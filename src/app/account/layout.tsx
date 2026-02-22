import { redirect } from "next/navigation";
import Link from "next/link";
import { cookies } from "next/headers";
import { COOKIE_NAME, parseSessionFromToken } from "@/lib/session";
import DynamicIcon from "@/components/DynamicIcon";

export default async function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  const session = await parseSessionFromToken(token);

  if (!session || session.role !== "CLIENT") {
    if (session?.role === "ADMIN") {
      redirect("/admin");
    }
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
      <aside className="w-full md:w-64 bg-white border-r border-gray-200 md:min-h-screen">
        <div className="p-6 border-b border-gray-100 flex items-center gap-3">
          <div className="bg-indigo-100 p-2 rounded-full text-indigo-600">
            <DynamicIcon name="user" className="w-5 h-5" />
          </div>
          <Link href="/account">
          <span className="font-bold text-gray-800">Mon Espace</span>
          </Link>
          
        </div>

        <nav className="p-4 space-y-2">
          <NavLink href="/account/appointments" icon="calendar" label="Mes Rendez-vous" />
          <NavLink href="/compte/documents" icon="file-text" label="Documents" />
          <NavLink href="/compte/profil" icon="settings" label="Mon Profil" />
          
          <div className="pt-4 mt-4 border-t border-gray-100">
             {/* Bouton déconnexion (formulaire pour action serveur) */}
             <form action="/api/auth/logout" method="POST">
                <button className="flex items-center gap-3 w-full px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors text-sm font-medium">
                  <DynamicIcon name="log-out" className="w-4 h-4" />
                  Se déconnecter
                </button>
             </form>
          </div>
        </nav>
      </aside>

      {/* CONTENU PRINCIPAL */}
      <main className="flex-1 p-6 md:p-10">
        <div className="max-w-4xl mx-auto">
            {children}
        </div>
      </main>
    </div>
  );
}

function NavLink({ href, icon, label }: { href: string; icon: string; label: string }) {
  return (
    <Link 
      href={href} 
      className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-indigo-50 hover:text-indigo-600 rounded-lg transition-all group"
    >
      <DynamicIcon name={icon} className="w-4 h-4 text-gray-400 group-hover:text-indigo-600" />
      <span className="font-medium text-sm">{label}</span>
    </Link>
  );
}