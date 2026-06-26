"use client";
import { useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { Folder } from "./types";
import { UploadIcon, PlusIcon, LogOutIcon } from "./icons";

interface Props {
  folders: Folder[];
  currentFolderId: string | null;
  onNavigate: (folderId: string | null) => void;
  onCreateFolder: () => void;
  onUpload: () => void;
}

interface TreeNode extends Folder {
  children: TreeNode[];
}

function buildTree(folders: Folder[], parentId: string | null = null): TreeNode[] {
  return folders
    .filter((f) => f.parentId === parentId)
    .map((f) => ({ ...f, children: buildTree(folders, f.id) }));
}

/* ── Ícones inline precisos como na referência ── */

const IcoChevronRight = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="9 18 15 12 9 6" />
  </svg>
);

const IcoFolderOutline = ({ active }: { active?: boolean }) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
    stroke={active ? "#005BAC" : "#9ca3af"} strokeWidth="1.8"
    strokeLinecap="round" strokeLinejoin="round"
    style={{ flexShrink: 0 }}>
    <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
  </svg>
);

const IcoFolderFilled = () => (
  <svg width="18" height="18" viewBox="0 0 24 24"
    fill="#005BAC" style={{ flexShrink: 0 }}>
    <path d="M10 4H4c-1.11 0-2 .89-2 2v12c0 1.1.89 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2h-8l-2-2z" />
  </svg>
);

const IcoFile = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
    stroke="#b0b8c8" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"
    style={{ flexShrink: 0 }}>
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
  </svg>
);

const IcoHome = ({ active }: { active?: boolean }) => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none"
    stroke={active ? "#005BAC" : "#9ca3af"} strokeWidth="1.8"
    strokeLinecap="round" strokeLinejoin="round"
    style={{ flexShrink: 0 }}>
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    <polyline points="9 22 9 12 15 12 15 22" />
  </svg>
);

/* ── TreeItem ── */
function TreeItem({
  node,
  depth,
  currentFolderId,
  onNavigate,
}: {
  node: TreeNode;
  depth: number;
  currentFolderId: string | null;
  onNavigate: (id: string | null) => void;
}) {
  const [open, setOpen] = useState(currentFolderId === node.id);
  const isActive = currentFolderId === node.id;
  const hasChildren = node.children.length > 0;
  const INDENT = 20;

  const toggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    setOpen((v) => !v);
  };

  return (
    <div>
      {/* ── Row ── */}
      <div
        className={`fi-row ${isActive ? "fi-row--active" : ""}`}
        style={{ paddingLeft: depth * INDENT }}
        onClick={() => {
          onNavigate(node.id);
          if (hasChildren && !open) setOpen(true);
        }}
      >
        {/* Chevron */}
        <span
          className={`fi-chevron ${open ? "fi-chevron--open" : ""} ${!hasChildren ? "fi-chevron--hidden" : ""}`}
          onClick={hasChildren ? toggle : undefined}
        >
          <IcoChevronRight />
        </span>

        {/* Folder icon */}
        {open ? <IcoFolderFilled /> : <IcoFolderOutline active={isActive} />}

        {/* Name */}
        <span className={`fi-label ${isActive ? "fi-label--active" : ""}`}>
          {node.name}
        </span>
      </div>

      {/* ── Children ── */}
      {open && (
        <div>
          {node.children.map((child) => (
            <TreeItem
              key={child.id}
              node={child}
              depth={depth + 1}
              currentFolderId={currentFolderId}
              onNavigate={onNavigate}
            />
          ))}
          {/* Placeholder file items to show it has content */}
          {node.children.length === 0 && (
            <div
              className="fi-row fi-row--file"
              style={{ paddingLeft: (depth + 1) * INDENT }}
            >
              <span className="fi-chevron fi-chevron--hidden"><IcoChevronRight /></span>
              <IcoFile />
              <span className="fi-label fi-label--file">pasta vazia</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/* ── Sidebar ── */
export function Sidebar({
  folders,
  currentFolderId,
  onNavigate,
  onCreateFolder,
  onUpload,
}: Props) {
  const { data: session } = useSession();
  const tree = buildTree(folders, null);
  const initial = session?.user?.name?.[0]?.toUpperCase() ?? "U";
  const isRoot = currentFolderId === null;

  return (
    <aside className="drive-sidebar">
      {/* ── Logo ── */}
      <div className="drive-sidebar-logo">
        <div className="drive-sidebar-logo-icon">📸</div>
        <div>
          <div className="drive-sidebar-logo-text">SaiuNaMídia</div>
          <div className="drive-sidebar-logo-sub">COPASA</div>
        </div>
      </div>

      {/* ── Action buttons ── */}
      <div style={{ padding: "10px 12px 8px", display: "flex", flexDirection: "column", gap: 6 }}>
        <button className="drive-upload-btn" onClick={onUpload}>
          <UploadIcon style={{ width: 15, height: 15 }} />
          Enviar imagens
        </button>
        <button className="drive-new-folder-btn" onClick={onCreateFolder}>
          <PlusIcon style={{ width: 14, height: 14 }} />
          Nova pasta
        </button>
      </div>

      {/* ── Divider ── */}
      <div style={{ height: 1, background: "#f0f2f5", margin: "0 0 6px" }} />

      {/* ── File tree ── */}
      <div className="drive-folder-tree">
        {/* Root row — "Início" — no chevron, just home icon */}
        <div
          className={`fi-row ${isRoot ? "fi-row--active" : ""}`}
          style={{ paddingLeft: 0 }}
          onClick={() => onNavigate(null)}
        >
          <span className="fi-chevron fi-chevron--hidden"><IcoChevronRight /></span>
          <IcoHome active={isRoot} />
          <span className={`fi-label ${isRoot ? "fi-label--active" : ""}`}>
            Início
          </span>
        </div>

        {/* Folder tree */}
        {tree.map((node) => (
          <TreeItem
            key={node.id}
            node={node}
            depth={0}
            currentFolderId={currentFolderId}
            onNavigate={onNavigate}
          />
        ))}
      </div>

      {/* ── Footer ── */}
      <div className="drive-sidebar-footer">
        <div
          className="drive-sidebar-user"
          onClick={() => signOut({ callbackUrl: "/login" })}
          title="Sair da conta"
        >
          <div className="drive-sidebar-avatar">{initial}</div>
          <div className="drive-sidebar-user-info">
            <div className="drive-sidebar-user-name">
              {session?.user?.name ?? "Usuário"}
            </div>
            <div className="drive-sidebar-user-action">Sair da conta</div>
          </div>
          <LogOutIcon style={{ width: 15, height: 15, color: "#9ca3af", flexShrink: 0 }} />
        </div>
      </div>
    </aside>
  );
}
