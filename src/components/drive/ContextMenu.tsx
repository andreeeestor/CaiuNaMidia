"use client";
import { useEffect, useRef } from "react";
import { DriveImage, Folder } from "./types";
import { EyeIcon, CopyIcon, MoveIcon, TrashIcon, DownloadIcon, FolderIcon } from "./icons";

interface ContextMenuProps {
  x: number;
  y: number;
  target: { type: "image"; item: DriveImage } | { type: "folder"; item: Folder };
  onClose: () => void;
  onPreview?: (img: DriveImage) => void;
  onCopyUrl?: (img: DriveImage) => void;
  onMove?: (item: DriveImage | Folder) => void;
  onDelete?: (item: DriveImage | Folder) => void;
  onRename?: (item: DriveImage | Folder) => void;
}

export function ContextMenu({
  x, y, target, onClose,
  onPreview, onCopyUrl, onMove, onDelete, onRename,
}: ContextMenuProps) {
  const ref = useRef<HTMLDivElement>(null);

  // Adjust position to keep inside viewport
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    if (rect.right > window.innerWidth) el.style.left = `${x - rect.width}px`;
    if (rect.bottom > window.innerHeight) el.style.top = `${y - rect.height}px`;
  }, [x, y]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    };
    const keyHandler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("mousedown", handler);
    document.addEventListener("keydown", keyHandler);
    return () => {
      document.removeEventListener("mousedown", handler);
      document.removeEventListener("keydown", keyHandler);
    };
  }, [onClose]);

  const isImage = target.type === "image";

  return (
    <div
      ref={ref}
      className="context-menu"
      style={{ left: x, top: y }}
      onContextMenu={(e) => e.preventDefault()}
    >
      {isImage && onPreview && (
        <div className="ctx-item" onClick={() => { onPreview(target.item as DriveImage); onClose(); }}>
          <EyeIcon /> Visualizar
        </div>
      )}
      {isImage && onCopyUrl && (
        <div className="ctx-item" onClick={() => { onCopyUrl(target.item as DriveImage); onClose(); }}>
          <CopyIcon /> Copiar URL
        </div>
      )}
      {isImage && (
        <div
          className="ctx-item"
          onClick={() => {
            const img = target.item as DriveImage;
            const a = document.createElement("a");
            a.href = img.url;
            a.download = img.name ?? img.key.split("/").pop() ?? "image";
            a.target = "_blank";
            a.click();
            onClose();
          }}
        >
          <DownloadIcon /> Baixar
        </div>
      )}
      {onMove && (
        <div className="ctx-item" onClick={() => { onMove(target.item); onClose(); }}>
          <MoveIcon /> Mover para...
        </div>
      )}
      <div className="ctx-divider" />
      {onDelete && (
        <div className="ctx-item danger" onClick={() => { onDelete(target.item); onClose(); }}>
          <TrashIcon /> Excluir
        </div>
      )}
    </div>
  );
}
