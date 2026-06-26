import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

export default cloudinary;

export interface CloudinaryImage {
  key: string; // public_id
  url: string; // secure_url
  size: number; // bytes
  uploadedAt: string;
}

export async function listImages(): Promise<CloudinaryImage[]> {
  const result = await cloudinary.api.resources({
    type: "upload",
    prefix: "imghub/",
    max_results: 500,
    resource_type: "image",
  });

  return (result.resources as any[])
    .sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
    )
    .map((r) => ({
      key: r.public_id,
      url: r.secure_url,
      size: r.bytes,
      uploadedAt: r.created_at,
    }));
}

export async function deleteImage(publicId: string): Promise<void> {
  await cloudinary.uploader.destroy(publicId);
}
