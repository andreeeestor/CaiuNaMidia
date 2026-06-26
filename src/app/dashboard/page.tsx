"use client";
import { useSession, signOut } from "next-auth/react";
import { useEffect, useState } from "react";
import { UploadZone } from "@/components/UploadZone";
import { ImageGrid } from "@/components/ImageGrid";

interface ImgItem {
  key: string;
  url: string;
  uploadedAt: string;
  size: number;
}

export default function DashboardPage() {
  const { data: session } = useSession();
  const [images, setImages] = useState<ImgItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/images")
      .then((r) => r.json())
      .then((data) => {
        setImages(data);
        setLoading(false);
      });
  }, []);

  const handleUpload = (img: ImgItem) => {
    setImages((prev) => [img, ...prev]);
  };

  const handleDelete = (key: string) => {
    setImages((prev) => prev.filter((img) => img.key !== key));
  };

  return (
    <div className="min-h-screen bg-zinc-50">
      {/* Header */}
      <header className="bg-white border-b border-zinc-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl">🖼️</span>
            <span className="font-bold text-zinc-800 text-lg">ImgHub</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-zinc-500 hidden sm:block">
              {session?.user?.name}
            </span>
            <span className="text-sm text-zinc-400 hidden sm:block">
              {images.length} {images.length === 1 ? "imagem" : "imagens"}
            </span>
            <button
              onClick={() => signOut({ callbackUrl: "/login" })}
              className="text-sm text-zinc-500 hover:text-red-500 transition-colors font-medium"
            >
              Sair
            </button>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
        <UploadZone onUpload={handleUpload} />

        {loading ? (
          <div className="text-center py-16">
            <div className="w-8 h-8 border-4 border-violet-500 border-t-transparent rounded-full animate-spin mx-auto" />
          </div>
        ) : (
          <ImageGrid images={images} onDelete={handleDelete} />
        )}
      </main>
    </div>
  );
}