import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import cloudinary, { listImages, deleteImage } from "@/lib/cloudinary";

export const runtime = "nodejs";
export const maxDuration = 60;

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/svg+xml"];
const MAX_SIZE = 10 * 1024 * 1024; // 10MB (limite seguro pro free tier da Vercel)

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

  try {
    const images = await listImages();
    return NextResponse.json(images);
  } catch (error) {
    console.error("Erro ao listar imagens:", error);
    return NextResponse.json({ error: "Erro ao buscar imagens" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) return NextResponse.json({ error: "Nenhum arquivo enviado" }, { status: 400 });
    if (!ALLOWED_TYPES.includes(file.type))
      return NextResponse.json({ error: "Tipo de arquivo não permitido" }, { status: 400 });
    if (file.size > MAX_SIZE)
      return NextResponse.json({ error: "Arquivo muito grande (máx 10MB)" }, { status: 400 });

    const buffer = Buffer.from(await file.arrayBuffer());
    const base64 = `data:${file.type};base64,${buffer.toString("base64")}`;

    const result = await cloudinary.uploader.upload(base64, {
      folder: "imghub",
      resource_type: "image",
    });

    return NextResponse.json({
      key: result.public_id,
      url: result.secure_url,
      name: file.name,
      size: result.bytes,
      uploadedAt: new Date().toISOString(),
      folderId: formData.get("folderId") ?? null,
    });
  } catch (error: unknown) {
    console.error("Erro no upload:", error);
    const msg = error instanceof Error ? error.message : "Erro interno ao fazer upload";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

  const { key } = await req.json();
  if (!key) return NextResponse.json({ error: "Key inválida" }, { status: 400 });

  try {
    await deleteImage(key);
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Erro ao deletar:", error);
    return NextResponse.json({ error: "Erro ao deletar" }, { status: 500 });
  }
}