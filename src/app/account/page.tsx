import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { COOKIE_NAME, parseSessionFromToken } from "@/lib/session";
import DynamicIcon from "@/components/DynamicIcon";
import Link from "next/link"

export default async function ClientDashboard() {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  const session = await parseSessionFromToken(token);

  if (!session) return null; 

  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    select: { firstName: true, lastName: true },
  });

  return (
    <div className="space-y-8">
      {/* En-tête de bienvenue */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Bonjour, {user?.firstName || "Client"} 👋
          </h1>
          <p className="text-gray-500 mt-1">
            Bienvenue sur votre espace personnel de suivi.
          </p>
        </div>
        <div className="hidden md:block bg-indigo-50 p-4 rounded-full">
            <DynamicIcon name="coffee" className="w-8 h-8 text-indigo-500" />
        </div>
      </div>

      {/* Grille d'actions rapides */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Carte 1 : Prochain RDV */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center gap-4 mb-4">
            <div className="bg-blue-100 p-3 rounded-lg text-blue-600">
              <DynamicIcon name="calendar-clock" className="w-6 h-6" />
            </div>
            <h3 className="font-semibold text-gray-800">Mon prochain RDV</h3>
          </div>
          <div className="text-gray-500 text-sm">
            Aucun rendez-vous planifié pour le moment.
          </div>
          <Link href="/book">
            <button className="mt-4 w-full py-2 text-sm text-blue-600 font-medium bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
              Prendre rendez-vous
            </button>
          </Link>
        </div>

        {/* Carte 2 : Documents */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center gap-4 mb-4">
            <div className="bg-purple-100 p-3 rounded-lg text-purple-600">
              <DynamicIcon name="folder-open" className="w-6 h-6" />
            </div>
            <h3 className="font-semibold text-gray-800">Mes Documents</h3>
          </div>
          <div className="text-gray-500 text-sm">
            Retrouvez ici vos factures et comptes-rendus.
          </div>
        </div>

        {/* Carte 3 : Support */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center gap-4 mb-4">
            <div className="bg-emerald-100 p-3 rounded-lg text-emerald-600">
              <DynamicIcon name="message-circle" className="w-6 h-6" />
            </div>
            <h3 className="font-semibold text-gray-800">Besoin d&apos;aide ?</h3>
          </div>
          <div className="text-gray-500 text-sm">
            Une question sur votre suivi ou un souci technique ?
          </div>
        </div>

      </div>
    </div>
  );
}