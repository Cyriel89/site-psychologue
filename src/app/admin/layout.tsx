import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import Link from "next/link";
import { COOKIE_NAME, parseSessionFromToken } from "@/lib/session";
import { prisma } from "@/lib/prisma";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;

  if (!token) {
    redirect("/login");
  }

  const session = await parseSessionFromToken(token);

  if (!session || !session.userId) {
    redirect("/login");
  }

  const user = await prisma.user.findUnique({
    where: { id: session.userId as string },
    select: { role: true },
  });

  if (!user || (user.role !== "ADMIN" && user.role !== "SUPPORT")) {
    redirect("/account");
  }

  return (
    <div className="min-h-screen grid grid-cols-[240px_1fr]">
      {/* SIDEBAR NOIRE */}
      <aside className="bg-gray-900 text-gray-100 p-4 space-y-3 h-screen sticky top-0 overflow-y-auto">
        <div className="font-bold text-lg mb-4 text-white">Admin Panel</div>
        
        <nav className="space-y-2 text-sm">
          <Link href="/admin" className="block text-gray-300 hover:text-white hover:underline transition-colors">Dashboard</Link>
          <Link href="/admin/hero" className="block text-gray-300 hover:text-white hover:underline transition-colors">Hero</Link>
          <Link href="/admin/about" className="block text-gray-300 hover:text-white hover:underline transition-colors">À propos</Link>
          <Link href="/admin/services" className="block text-gray-300 hover:text-white hover:underline transition-colors">Services</Link>
          <Link href="/admin/partners" className="block text-gray-300 hover:text-white hover:underline transition-colors">Partenaires</Link>
          <Link href="/admin/location" className="block text-gray-300 hover:text-white hover:underline transition-colors">Lieu & horaires</Link>
          <Link href="/admin/faq" className="block text-gray-300 hover:text-white hover:underline transition-colors">FAQ</Link>
          <Link href="/admin/contact" className="block text-gray-300 hover:text-white hover:underline transition-colors">Contact</Link>
          <Link href="/admin/media" className="block text-gray-300 hover:text-white hover:underline transition-colors">Média</Link>
          <Link href="/admin/legal-pages" className="block text-gray-300 hover:text-white hover:underline transition-colors">Pages légales</Link>
          <Link href="/admin/availability" className="block text-gray-300 hover:text-white hover:underline transition-colors">Disponibilités</Link>
        </nav>

        {/* Bouton Déconnexion */}
        <form action="/api/auth/logout" method="post" className="mt-8 pt-6 border-t border-gray-700">
          <button className="w-full flex items-center gap-2 text-sm bg-red-900/30 text-red-200 px-3 py-2 rounded hover:bg-red-900/50 transition-colors">
            Se déconnecter
          </button>
        </form>

        {/* Lien retour site */}
        <nav className="space-y-2 text-sm mt-4">
          <Link href="/" className="block text-indigo-400 hover:text-indigo-300 hover:underline">
            ← Voir le site
          </Link>
        </nav>
      </aside>

      {/* CONTENU PRINCIPAL */}
      <main className="p-8 bg-gray-50 min-h-screen">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 min-h-[500px]">
            {children}
        </div>
      </main>
    </div>
  );
}