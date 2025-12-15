import { prisma } from "@/lib/prisma";
import { requireAdminOrSupport } from "@/lib/authServer";
import MediaClient from "./MediaClient";

export default async function AdminMediaPage() {
  await requireAdminOrSupport();

  const medias = await prisma.media.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="max-w-6xl mx-auto pb-10">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Médiathèque</h1>
        <p className="text-gray-500 mt-1">
          Gérez ici toutes les images de votre site. Les fichiers sont stockés localement sur le serveur.
        </p>
      </div>

      <MediaClient initialMedia={medias} />
    </div>
  );
}