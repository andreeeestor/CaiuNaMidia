"use client";
import "./dashboard.css";
import { useEffect, useState, useCallback } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

import { Folder, DriveImage, ViewMode, ContextMenuState } from "@/components/drive/types";
import { Sidebar } from "@/components/drive/Sidebar";
import { ContextMenu } from "@/components/drive/ContextMenu";
import { UploadModal } from "@/components/drive/UploadModal";
import { NewFolderModal, MoveModal, Lightbox } from "@/components/drive/Modals";
import {
  BreadcrumbNav,
  ViewToggle,
  SearchBar,
  ContentArea,
} from "@/components/drive/ContentArea";
import { TrashIcon, MoveIcon, XIcon, UploadIcon } from "@/components/drive/icons";

/* ── Toast ── */
type Toast = { id: number; msg: string; type: "success" | "error" | "info" };
let toastId = 0;

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  // Redirect if not authenticated
  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
  }, [status, router]);

  /* ── State ── */
  const [images, setImages] = useState<DriveImage[]>([]);
  const [folders, setFolders] = useState<Folder[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentFolderId, setCurrentFolderId] = useState<string | null>(null);
  const [view, setView] = useState<ViewMode>("grid");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [draggingOver, setDraggingOver] = useState(false);

  // Modals
  const [showUpload, setShowUpload] = useState(false);
  const [showNewFolder, setShowNewFolder] = useState(false);
  const [moveTarget, setMoveTarget] = useState<DriveImage | Folder | null>(null);
  const [lightbox, setLightbox] = useState<DriveImage | null>(null);
  const [copied, setCopied] = useState(false);

  // Context menu
  const [ctx, setCtx] = useState<ContextMenuState | null>(null);

  // Toasts
  const [toasts, setToasts] = useState<Toast[]>([]);

  /* ── Helpers ── */
  const toast = useCallback((msg: string, type: Toast["type"] = "info") => {
    const id = ++toastId;
    setToasts((prev) => [...prev, { id, msg, type }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 3000);
  }, []);

  const FOLDERS_KEY = "imghub_folders";
  const loadFolders = useCallback((): Folder[] => {
    try {
      return JSON.parse(localStorage.getItem(FOLDERS_KEY) ?? "[]");
    } catch {
      return [];
    }
  }, []);
  const saveFolders = useCallback((flds: Folder[]) => {
    localStorage.setItem(FOLDERS_KEY, JSON.stringify(flds));
  }, []);

  /* ── Load data ── */
  useEffect(() => {
    if (status !== "authenticated") return;
    setFolders(loadFolders());
    fetch("/api/images")
      .then((r) => r.ok ? r.json() : [])
      .then((data: DriveImage[]) => {
        // Restore folderId from localStorage metadata
        const meta = JSON.parse(localStorage.getItem("imghub_image_meta") ?? "{}");
        setImages(data.map((img) => ({ ...img, folderId: meta[img.key] ?? null })));
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [status, loadFolders]);

  /* ── Image metadata persistence (folderId) ── */
  const saveImageMeta = useCallback((imgs: DriveImage[]) => {
    const meta: Record<string, string | null> = {};
    imgs.forEach((img) => { meta[img.key] = img.folderId ?? null; });
    localStorage.setItem("imghub_image_meta", JSON.stringify(meta));
  }, []);

  /* ── Folder actions ── */
  const handleCreateFolder = useCallback((name: string) => {
    const newFolder: Folder = {
      id: crypto.randomUUID(),
      name,
      parentId: currentFolderId,
      createdAt: new Date().toISOString(),
    };
    const updated = [...folders, newFolder];
    setFolders(updated);
    saveFolders(updated);
    setShowNewFolder(false);
    toast(`Pasta "${name}" criada`, "success");
  }, [folders, currentFolderId, saveFolders, toast]);

  const handleDeleteFolder = useCallback((folder: Folder) => {
    if (!confirm(`Excluir a pasta "${folder.name}"? As imagens dentro dela voltarão para Início.`)) return;
    // Move images in this folder to root
    const updated = images.map((img) =>
      img.folderId === folder.id ? { ...img, folderId: null } : img
    );
    setImages(updated);
    saveImageMeta(updated);
    // Remove folder (and children)
    const idsToRemove = getDescendantIds(folder, folders);
    const updatedFolders = folders.filter((f) => !idsToRemove.includes(f.id));
    setFolders(updatedFolders);
    saveFolders(updatedFolders);
    if (currentFolderId && idsToRemove.includes(currentFolderId)) {
      setCurrentFolderId(null);
    }
    toast(`Pasta excluída`, "info");
  }, [folders, images, currentFolderId, saveFolders, saveImageMeta, toast]);

  /* ── Image actions ── */
  const handleUpload = useCallback((img: DriveImage) => {
    const withFolder = { ...img, folderId: currentFolderId };
    setImages((prev) => {
      const updated = [withFolder, ...prev];
      saveImageMeta(updated);
      return updated;
    });
    toast("Imagem enviada!", "success");
  }, [currentFolderId, saveImageMeta, toast]);

  const handleDeleteImage = useCallback(async (image: DriveImage) => {
    if (!confirm("Excluir esta imagem permanentemente?")) return;
    await fetch("/api/images", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ key: image.key }),
    });
    setImages((prev) => {
      const updated = prev.filter((i) => i.key !== image.key);
      saveImageMeta(updated);
      return updated;
    });
    toast("Imagem excluída", "info");
  }, [saveImageMeta, toast]);

  const handleDeleteSelected = useCallback(async () => {
    if (!confirm(`Excluir ${selected.size} imagem(ns)?`)) return;
    const keys = Array.from(selected);
    await Promise.all(
      keys.map((key) =>
        fetch("/api/images", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ key }),
        })
      )
    );
    setImages((prev) => {
      const updated = prev.filter((i) => !selected.has(i.key));
      saveImageMeta(updated);
      return updated;
    });
    setSelected(new Set());
    toast(`${keys.length} imagem(ns) excluída(s)`, "info");
  }, [selected, saveImageMeta, toast]);

  /* ── Move ── */
  const handleMove = useCallback((targetFolderId: string | null) => {
    if (!moveTarget) return;
    const isFolder = "parentId" in moveTarget;

    if (isFolder) {
      const f = moveTarget as Folder;
      const updatedFolders = folders.map((x) =>
        x.id === f.id ? { ...x, parentId: targetFolderId } : x
      );
      setFolders(updatedFolders);
      saveFolders(updatedFolders);
    } else {
      const img = moveTarget as DriveImage;
      setImages((prev) => {
        const updated = prev.map((i) =>
          i.key === img.key ? { ...i, folderId: targetFolderId } : i
        );
        saveImageMeta(updated);
        return updated;
      });
    }
    setMoveTarget(null);
    toast("Movido com sucesso!", "success");
  }, [moveTarget, folders, saveFolders, saveImageMeta, toast]);

  /* ── Selection ── */
  const handleSelect = useCallback((key: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  }, []);

  /* ── Copy URL ── */
  const handleCopy = useCallback(async (img: DriveImage) => {
    await navigator.clipboard.writeText(img.url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast("URL copiada!", "success");
  }, [toast]);

  /* ── Global drag & drop ── */
  const onGlobalDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDraggingOver(true);
  }, []);
  const onGlobalDragLeave = useCallback((e: React.DragEvent) => {
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      setDraggingOver(false);
    }
  }, []);
  const onGlobalDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDraggingOver(false);
    if (e.dataTransfer.files.length > 0) setShowUpload(true);
  }, []);

  if (status === "loading" || status === "unauthenticated") {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100vh", background: "#f8f9fa" }}>
        <div style={{ width: 36, height: 36, border: "3px solid #e5e7eb", borderTopColor: "#6366f1", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <div
      className="drive-root"
      onDragOver={onGlobalDragOver}
      onDragLeave={onGlobalDragLeave}
      onDrop={onGlobalDrop}
    >
      {/* Sidebar */}
      <Sidebar
        folders={folders}
        currentFolderId={currentFolderId}
        onNavigate={(id) => { setCurrentFolderId(id); setSelected(new Set()); setSearch(""); }}
        onCreateFolder={() => setShowNewFolder(true)}
        onUpload={() => setShowUpload(true)}
      />

      {/* Main */}
      <div className="drive-main">
        {/* Toolbar */}
        <div className="drive-toolbar">
          <BreadcrumbNav
            folders={folders}
            currentFolderId={currentFolderId}
            onNavigate={(id) => { setCurrentFolderId(id); setSelected(new Set()); setSearch(""); }}
          />
          <div className="drive-toolbar-actions">
            <SearchBar value={search} onChange={setSearch} />
            <ViewToggle view={view} onToggle={() => setView(view === "grid" ? "list" : "grid")} />
          </div>
        </div>

        {/* Content */}
        <div className="drive-content">
          <ContentArea
            folders={folders}
            images={images}
            currentFolderId={currentFolderId}
            view={view}
            search={search}
            selected={selected}
            loading={loading}
            onNavigate={(id) => { setCurrentFolderId(id); setSelected(new Set()); setSearch(""); }}
            onSelect={handleSelect}
            onPreview={(img) => setLightbox(img)}
            onContextMenu={(e, target) => setCtx({ x: e.clientX, y: e.clientY, target })}
          />
        </div>
      </div>

      {/* Context Menu */}
      {ctx && (
        <ContextMenu
          x={ctx.x}
          y={ctx.y}
          target={ctx.target}
          onClose={() => setCtx(null)}
          onPreview={(img) => setLightbox(img)}
          onCopyUrl={handleCopy}
          onMove={(item) => setMoveTarget(item)}
          onDelete={(item) =>
            "uploadedAt" in item
              ? handleDeleteImage(item as DriveImage)
              : handleDeleteFolder(item as Folder)
          }
        />
      )}

      {/* Selection bar */}
      {selected.size > 0 && (
        <div className="selection-bar">
          <span>{selected.size} selecionada(s)</span>
          <button
            className="sel-btn"
            onClick={() => {
              const first = images.find((i) => selected.has(i.key));
              if (first) setMoveTarget(first);
            }}
          >
            <MoveIcon /> Mover
          </button>
          <button className="sel-btn danger" onClick={handleDeleteSelected}>
            <TrashIcon /> Excluir
          </button>
          <button className="sel-btn" onClick={() => setSelected(new Set())}>
            <XIcon /> Fechar
          </button>
        </div>
      )}

      {/* Drag over overlay */}
      {draggingOver && (
        <div className="upload-drop-overlay">
          <div className="upload-drop-label">
            <UploadIcon style={{ width: 40, height: 40, color: "#005BAC" }} />
            <p>Solte para enviar</p>
          </div>
        </div>
      )}

      {/* Modals */}
      {showUpload && (
        <UploadModal
          currentFolderId={currentFolderId}
          onUpload={handleUpload}
          onClose={() => setShowUpload(false)}
        />
      )}
      {showNewFolder && (
        <NewFolderModal
          onConfirm={handleCreateFolder}
          onClose={() => setShowNewFolder(false)}
        />
      )}
      {moveTarget && (
        <MoveModal
          item={moveTarget}
          folders={folders}
          currentFolderId={"folderId" in moveTarget ? (moveTarget as DriveImage).folderId ?? null : (moveTarget as Folder).parentId}
          onConfirm={handleMove}
          onClose={() => setMoveTarget(null)}
        />
      )}
      {lightbox && (
        <Lightbox
          image={lightbox}
          onClose={() => setLightbox(null)}
          onCopy={() => handleCopy(lightbox)}
          copied={copied}
        />
      )}

      {/* Toasts */}
      <div className="toast-container">
        {toasts.map((t) => (
          <div key={t.id} className={`toast ${t.type}`}>
            {t.type === "success" ? "✓" : t.type === "error" ? "✕" : "ℹ"} {t.msg}
          </div>
        ))}
      </div>
    </div>
  );
}

function getDescendantIds(folder: Folder, all: Folder[]): string[] {
  const ids = [folder.id];
  const children = all.filter((f) => f.parentId === folder.id);
  for (const child of children) ids.push(...getDescendantIds(child, all));
  return ids;
}