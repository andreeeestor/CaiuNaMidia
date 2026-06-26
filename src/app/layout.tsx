import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/Providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ImgHub",
  description: "Hospede e compartilhe imagens com URL pública",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className={`${inter.className} bg-zinc-50 min-h-screen`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
