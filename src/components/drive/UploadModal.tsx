"use client";
import { useCallback, useState } from "react";
import { DriveImage } from "./types";
import { UploadIcon, XIcon } from "./icons";

interface Props {
  currentFolderId: string | null;
  onUpload: (img: DriveImage) => void;
  onClose: () => void;
}

export function UploadModal({ currentFolderId, onUpload, onClose }: Props) {
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState<{ name: string; done: boolean }[]>([]);
  const [error, setError] = useState<string | null>(null);

  const upload = useCallback(
    async (files: FileList | null) => {
      if (!files || files.length === 0) return;
      setError(null);
      setUploading(true);
      const fileArr = Array.from(files);
      setProgress(fileArr.map((f) => ({ name: f.name, done: false })));

      for (let i = 0; i < fileArr.length; i++) {
        const file = fileArr[i];
        const fd = new FormData();
        fd.append("file", file);
        if (currentFolderId) fd.append("folderId", currentFolderId);

        let res: Response;
        let data: Record<string, unknown> = {};

        try {
          res = await fetch("/api/images", { method: "POST", body: fd });
          // Guard: parse JSON only if the server actually sent JSON
          const text = await res.text();
          data = text ? JSON.parse(text) : {};
        } catch (err) {
          console.error("Erro de rede ou JSON inválido:", err);
          setError("Erro de conexão com o servidor. Tente novamente.");
          setUploading(false);
          return;
        }

        if (!res.ok) {
          const msg = (data.error as string) ?? `Erro ${res.status} ao enviar "${file.name}"`;
          setError(msg);
        } else {
          onUpload({ ...(data as unknown as Parameters<typeof onUpload>[0]), folderId: currentFolderId });
          setProgress((prev) =>
            prev.map((p, idx) => (idx === i ? { ...p, done: true } : p))
          );
        }
      }
      setUploading(false);
    },
    [currentFolderId, onUpload]
  );

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragging(false);
      upload(e.dataTransfer.files);
    },
    [upload]
  );

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <span className="modal-title">Enviar imagens</span>
          <button className="modal-close" onClick={onClose}>
            <XIcon />
          </button>
        </div>
        <div className="modal-body">
          <div
            className={`upload-zone ${dragging ? "dragging" : ""}`}
            onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            onDrop={onDrop}
            onClick={() => document.getElementById("modal-file-input")?.click()}
          >
            <input
              id="modal-file-input"
              type="file"
              multiple
              accept="image/*"
              style={{ display: "none" }}
              onChange={(e) => upload(e.target.files)}
            />
            <UploadIcon />
            <p>
              <strong>Clique para selecionar</strong> ou arraste aqui
            </p>
            <p style={{ fontSize: 12, marginTop: 4, color: "#9ca3af" }}>
              JPG, PNG, WebP, GIF, SVG • máx 10MB por arquivo
            </p>
          </div>

          {progress.length > 0 && (
            <div className="upload-progress" style={{ marginTop: 16 }}>
              {progress.map((p, i) => (
                <div key={i} style={{ marginBottom: 8 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "#6b7280", marginBottom: 4 }}>
                    <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: "80%" }}>{p.name}</span>
                    <span style={{ color: p.done ? "#059669" : "#6366f1" }}>{p.done ? "✓" : "..."}</span>
                  </div>
                  <div className="upload-progress-bar">
                    <div className="upload-progress-fill" style={{ width: p.done ? "100%" : "60%" }} />
                  </div>
                </div>
              ))}
            </div>
          )}

          {error && (
            <p style={{ fontSize: 13, color: "#ef4444", marginTop: 12 }}>{error}</p>
          )}
        </div>
        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose} disabled={uploading}>
            {uploading ? "Enviando..." : "Fechar"}
          </button>
        </div>
      </div>
    </div>
  );
}
