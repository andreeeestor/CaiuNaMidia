"use client";
import { useState } from "react";
import Image from "next/image";

interface ImgItem {
  key: string;
  url: string;
  uploadedAt: string;
  size: number;
}

interface Props {
  images: ImgItem[];
  onDelete: (key: string) => void;
}

export function ImageGrid({ images, onDelete }: Props) {
  const [copied, setCopied] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [preview, setPreview] = useState<ImgItem | null>(null);

  const copy = async (url: string) => {
    await navigator.clipboard.writeText(url);
    setCopied(url);
    setTimeout(() => setCopied(null), 2000);
  };

  const del = async (key: string) => {
    if (!confirm("Deletar esta imagem?")) return;
    setDeleting(key);
    await fetch("/api/images", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ key }),
    });
    onDelete(key);
    setDeleting(null);
  };

  const fmt = (bytes: number) =>
    bytes < 1024 * 1024
      ? `${(bytes / 1024).toFixed(1)} KB`
      : `${(bytes / 1024 / 1024).toFixed(1)} MB`;

  if (images.length === 0) {
    return (
      <div className="text-center py-16 text-zinc-400">
        <p className="text-5xl mb-3">📭</p>
        <p className="text-sm">Nenhuma imagem ainda. Faça o primeiro upload!</p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {images.map((img) => (
          <div
            key={img.key}
            className="group relative bg-zinc-100 rounded-xl overflow-hidden border border-zinc-200 hover:border-violet-300 hover:shadow-lg transition-all duration-200"
          >
            {/* Thumbnail */}
            <div
              className="aspect-square relative cursor-pointer"
              onClick={() => setPreview(img)}
            >
              <Image
                src={img.url}
                alt={img.key}
                fill
                className="object-cover"
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                unoptimized
              />
            </div>

            {/* Actions overlay */}
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col items-center justify-center gap-2 p-2">
              <button
                onClick={() => copy(img.url)}
                className="w-full text-xs font-medium bg-white text-zinc-800 rounded-lg py-1.5 hover:bg-violet-100 transition-colors"
              >
                {copied === img.url ? "✅ Copiado!" : "📋 Copiar URL"}
              </button>
              <button
                onClick={() => del(img.key)}
                disabled={deleting === img.key}
                className="w-full text-xs font-medium bg-red-500 text-white rounded-lg py-1.5 hover:bg-red-600 transition-colors disabled:opacity-50"
              >
                {deleting === img.key ? "..." : "🗑️ Deletar"}
              </button>
            </div>

            {/* Info bar */}
            <div className="px-2 py-1.5 bg-white border-t border-zinc-100">
              <p className="text-xs text-zinc-400 truncate">{fmt(img.size)}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox preview */}
      {preview && (
        <div
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
          onClick={() => setPreview(null)}
        >
          <div
            className="bg-white rounded-2xl overflow-hidden max-w-2xl w-full shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative aspect-video bg-zinc-100">
              <Image
                src={preview.url}
                alt={preview.key}
                fill
                className="object-contain"
                unoptimized
              />
            </div>
            <div className="p-4 flex items-center gap-3">
              <input
                readOnly
                value={preview.url}
                className="flex-1 text-xs bg-zinc-100 rounded-lg px-3 py-2 font-mono text-zinc-600 outline-none"
              />
              <button
                onClick={() => copy(preview.url)}
                className="text-sm font-medium bg-violet-600 text-white rounded-lg px-4 py-2 hover:bg-violet-700 transition-colors whitespace-nowrap"
              >
                {copied === preview.url ? "✅ Copiado!" : "Copiar URL"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
