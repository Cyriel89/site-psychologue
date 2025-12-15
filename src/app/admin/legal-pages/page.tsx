import { prisma } from "@/lib/prisma";
import { requireAdminOrSupport } from "@/lib/authServer";
import Link from "next/link";
import DynamicIcon from "@/components/DynamicIcon";
import { PageSlug } from "@prisma/client";

export default async function AdminPagesList() {
  await requireAdminOrSupport();

  const pages = await prisma.page.findMany({
    orderBy: { updatedAt: "desc" },
  });

  const getPublicLink = (slug: string) => {
    if (slug === PageSlug.MENTIONS_LEGALES) return "/legal-notice";
    if (slug === PageSlug.POLITIQUE_DE_CONFIDENTIALITE) return "/privacy-policy";
    return `/${slug}`; // Fallback
  };

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Pages Légales</h1>
        <p className="text-gray-500 mt-1">
          Gérez le contenu de vos mentions légales et politique de confidentialité.
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden divide-y divide-gray-100">
        {pages.map((p) => (
          <div key={p.id} className="p-5 flex items-center justify-between hover:bg-gray-50 transition-colors">
            
            <div className="flex items-center gap-4">
                <div className="bg-indigo-50 p-3 rounded-lg text-indigo-600">
                    <DynamicIcon name="file-text" className="w-6 h-6" />
                </div>
                <div>
                    <h3 className="font-semibold text-gray-800 text-lg">{p.title}</h3>
                    <div className="flex items-center gap-3 mt-1 text-sm">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                            p.status === "PUBLISHED" ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"
                        }`}>
                            {p.status === "PUBLISHED" ? "PUBLIÉ" : "BROUILLON"}
                        </span>
                        <span className="text-gray-400">
                            Modifié le {p.updatedAt.toLocaleDateString()}
                        </span>
                    </div>
                </div>
            </div>

            <div className="flex items-center gap-3">
                {p.status === "PUBLISHED" && (
                    <a 
                        href={getPublicLink(p.slug)} 
                        target="_blank" 
                        rel="noreferrer"
                        className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                        title="Voir la page"
                    >
                        <DynamicIcon name="external-link" className="w-5 h-5" />
                    </a>
                )}
                
                <Link 
                    href={`/admin/legal-pages/${p.id}/edit`}
                    className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium shadow-sm"
                >
                    <DynamicIcon name="edit-3" className="w-4 h-4" />
                    Éditer
                </Link>
            </div>

          </div>
        ))}

        {pages.length === 0 && (
            <div className="p-8 text-center text-gray-500">
                Aucune page trouvée. Avez-vous lancé le script de seed ?
            </div>
        )}
      </div>
    </div>
  );
}