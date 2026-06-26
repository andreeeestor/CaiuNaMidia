import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { listImages, deleteImage } from "@/lib/cloudinary";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session)
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

  const images = await listImages();
  return NextResponse.json(images);
}

export async function DELETE(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session)
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

  const { key } = await req.json();
  if (!key)
    return NextResponse.json({ error: "Key inválida" }, { status: 400 });

  await deleteImage(key);
  return NextResponse.json({ ok: true });
}
