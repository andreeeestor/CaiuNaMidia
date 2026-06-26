"use client";
import { useCallback, useState } from "react";

interface UploadedImage {
  key: string;
  url: string;
  name: string;
  size: number;
}

interface Props {
  onUpload: (img: UploadedImage) => void;
}

export function UploadZone({ onUpload }: Props) {
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const upload = useCallback(
    async (files: FileList | null) => {
      if (!files || files.length === 0) return;
      setError(null);
      setUploading(true);

      for (const file of Array.from(files)) {
        const fd = new FormData();
        fd.append("file", file);

        const res = await fetch("/api/upload", { method: "POST", body: fd });
        const data = await res.json();

        if (!res.ok) {
          setError(data.error ?? "Erro ao fazer upload");
        } else {
          onUpload(data);
        }
      }

      setUploading(false);
    },
    [onUpload],
  );

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragging(false);
      upload(e.dataTransfer.files);
    },
    [upload],
  );

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        setDragging(true);
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={onDrop}
      className={`
        relative flex flex-col items-center justify-center gap-3
        border-2 border-dashed rounded-2xl p-12 cursor-pointer
        transition-all duration-200 select-none
        ${
          dragging
            ? "border-violet-500 bg-violet-50"
            : "border-zinc-300 bg-zinc-50 hover:border-violet-400 hover:bg-violet-50/50"
        }
      `}
      onClick={() => document.getElementById("file-input")?.click()}
    >
      <input
        id="file-input"
        type="file"
        multiple
        accept="image/*"
        className="hidden"
        onChange={(e) => upload(e.target.files)}
      />

      {uploading ? (
        <>
          <div className="w-10 h-10 border-4 border-violet-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-zinc-500">Enviando...</p>
        </>
      ) : (
        <>
          <div className="text-4xl">🖼️</div>
          <div className="text-center">
            <p className="font-semibold text-zinc-700">Arraste imagens aqui</p>
            <p className="text-sm text-zinc-400 mt-1">
              ou clique para selecionar • JPG, PNG, WebP, GIF, SVG • máx 20MB
            </p>
          </div>
        </>
      )}

      {error && <p className="text-sm text-red-500 mt-2">{error}</p>}
    </div>
  );
}
