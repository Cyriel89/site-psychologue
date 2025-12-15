"use server";

import { prisma } from "@/lib/prisma";
import { requireAdminOrSupport } from "@/lib/authServer";
import { revalidatePath } from "next/cache";
import { writeFile, unlink, mkdir } from "fs/promises";
import path from "path";
import { v4 as uuidv4 } from "uuid";

const UPLOAD_DIR = path.join(process.cwd(), "public/uploads");
const MAX_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];

export async function uploadMediaAction(formData: FormData) {
  try {
    await requireAdminOrSupport();

    const file = formData.get("file") as File | null;
    const altText = (formData.get("alt") as string) || "";

    if (!file) {
      return { success: false, message: "Aucun fichier sélectionné." };
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return { success: false, message: "Format non supporté (JPG, PNG, WEBP uniquement)." };
    }
    if (file.size > MAX_SIZE) {
      return { success: false, message: "Fichier trop volumineux (Max 5Mo)." };
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const uniqueSuffix = uuidv4().split("-")[0]; 
    const originalName = file.name.replace(/\.[^/.]+$/, ""); // retire l'extension
    const extension = path.extname(file.name);
    const cleanName = originalName.replace(/[^a-z0-9]/gi, '-').toLowerCase();
    const fileName = `${cleanName}-${uniqueSuffix}${extension}`;
    const publicUrl = `/uploads/${fileName}`;
    const filePath = path.join(UPLOAD_DIR, fileName);

    await mkdir(UPLOAD_DIR, { recursive: true });
    await writeFile(filePath, buffer);

    await prisma.media.create({
      data: {
        url: publicUrl,
        alt: altText || cleanName,
        type: "IMAGE",
        mime: file.type,
      },
    });

    revalidatePath("/admin/media");
    return { success: true, message: "Image téléversée avec succès !" };

  } catch (error) {
    console.error("Upload error:", error);
    return { success: false, message: "Erreur serveur lors de l'upload." };
  }
}

export async function deleteMediaAction(id: string) {
  try {
    await requireAdminOrSupport();

    const media = await prisma.media.findUnique({ where: { id } });
    if (!media) return { success: false, message: "Fichier introuvable." };

    await prisma.media.delete({ where: { id } });

    if (media.url.startsWith("/uploads/")) {
      const fileName = media.url.replace("/uploads/", "");
      const filePath = path.join(UPLOAD_DIR, fileName);
      try {
        await unlink(filePath);
      } catch (e) {
        console.warn("Fichier physique introuvable, suppression DB uniquement.");
      }
    }

    revalidatePath("/admin/media");
    return { success: true, message: "Image supprimée." };

  } catch (error) {
    return { success: false, message: "Erreur lors de la suppression." };
  }
}