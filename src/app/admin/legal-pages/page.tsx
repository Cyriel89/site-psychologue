import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { PageSlug } from "@prisma/client";

export default async function AdminPagesList() {
  const pages = await prisma.page.findMany({
    orderBy: { updatedAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Pages (mentions & politique)</h1>
      <div className="border rounded-lg divide-y">
        {pages.map((p) => (
          <div key={p.id} className="p-4 flex items-center justify-between">
            <div>
              <div className="font-medium">{p.title}</div>
              <div className="text-sm text-gray-500">
                Slug: {p.slug} — Statut: {p.status} — Maj: {p.updatedAt.toLocaleString()}
              </div>
            </div>
            <div className="flex gap-2">
              <Link className="btn btn-secondary" href={`/admin/pages/${p.id}/edit`}>Éditer</Link>
              {p.slug === PageSlug.MENTIONS_LEGALES && (
                <Link className="btn" href="/mentions-legales" target="_blank">Voir</Link>
              )}
              {p.slug === PageSlug.POLITIQUE_DE_CONFIDENTIALITE && (
                <Link className="btn" href="/politique-de-confidentialite" target="_blank">Voir</Link>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
