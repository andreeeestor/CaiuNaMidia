"use client";
import { useState } from "react";
import { Folder, DriveImage } from "./types";
import { XIcon, FolderIcon, HomeIcon } from "./icons";

/* ── New Folder Modal ── */
export function NewFolderModal({
  onConfirm,
  onClose,
}: {
  onConfirm: (name: string) => void;
  onClose: () => void;
}) {
  const [name, setName] = useState("Nova Pasta");

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" style={{ maxWidth: 360 }} onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <span className="modal-title">Nova pasta</span>
          <button className="modal-close" onClick={onClose}><XIcon /></button>
        </div>
        <div className="modal-body">
          <div className="form-group">
            <label className="form-label">Nome da pasta</label>
            <input
              className="form-input"
              value={name}
              autoFocus
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter" && name.trim()) onConfirm(name.trim()); }}
            />
          </div>
        </div>
        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose}>Cancelar</button>
          <button
            className="btn btn-primary"
            disabled={!name.trim()}
            onClick={() => onConfirm(name.trim())}
          >
            Criar
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Move Modal ── */
export function MoveModal({
  item,
  folders,
  currentFolderId,
  onConfirm,
  onClose,
}: {
  item: DriveImage | Folder;
  folders: Folder[];
  currentFolderId: string | null;
  onConfirm: (targetFolderId: string | null) => void;
  onClose: () => void;
}) {
  const [selected, setSelected] = useState<string | null>(currentFolderId);
  const isFolder = "parentId" in item;
  // Can't move a folder into itself or its descendants
  const disabledIds = isFolder ? getDescendantIds(item as Folder, folders) : [];

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" style={{ maxWidth: 400 }} onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <span className="modal-title">Mover para...</span>
          <button className="modal-close" onClick={onClose}><XIcon /></button>
        </div>
        <div className="modal-body">
          <div className="folder-list">
            <div
              className={`folder-option ${selected === null ? "selected" : ""}`}
              onClick={() => setSelected(null)}
            >
              <HomeIcon /> Início (raiz)
            </div>
            {folders
              .filter((f) => !disabledIds.includes(f.id))
              .map((f) => (
                <div
                  key={f.id}
                  className={`folder-option ${selected === f.id ? "selected" : ""}`}
                  onClick={() => setSelected(f.id)}
                >
                  <FolderIcon /> {f.name}
                </div>
              ))}
          </div>
        </div>
        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose}>Cancelar</button>
          <button className="btn btn-primary" onClick={() => onConfirm(selected)}>
            Mover aqui
          </button>
        </div>
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

/* ── Lightbox ── */
export function Lightbox({
  image,
  onClose,
  onCopy,
  copied,
}: {
  image: DriveImage;
  onClose: () => void;
  onCopy: () => void;
  copied: boolean;
}) {
  return (
    <div className="lightbox" onClick={onClose}>
      <button className="lightbox-close" onClick={onClose}><XIcon /></button>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        className="lightbox-img"
        src={image.url}
        alt={image.name ?? image.key}
        onClick={(e) => e.stopPropagation()}
      />
      <div className="lightbox-info" onClick={(e) => e.stopPropagation()}>
        <span className="lightbox-url">{image.url}</span>
        <button
          className="btn btn-primary"
          style={{ padding: "6px 14px", fontSize: 12 }}
          onClick={onCopy}
        >
          {copied ? "✓ Copiado!" : "Copiar URL"}
        </button>
      </div>
    </div>
  );
}
