import Link from "next/link";
import { redirect } from "next/navigation";
import { requireAdminOrSupport } from "@/lib/authServer";

export const revalidate = 0;
export const dynamic = "force-dynamic";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const auth = requireAdminOrSupport();
  if (!auth) redirect("/"); 
  return (
    <div className="min-h-screen grid grid-cols-[240px_1fr]">
      <aside className="bg-gray-900 text-gray-100 p-4 space-y-3">
        <div className="font-bold text-lg mb-4">Admin</div>
        <nav className="space-y-2 text-sm">
          <Link href="/admin" className="block hover:underline">Dashboard</Link>
          <Link href="/admin/hero" className="block hover:underline">Hero</Link>
          <Link href="/admin/about" className="block hover:underline">À propos</Link>
          <Link href="/admin/services" className="block hover:underline">Services</Link>
          <Link href="/admin/partners" className="block hover:underline">Partenaires</Link>
          <Link href="/admin/location" className="block hover:underline">Lieu & horaires</Link>
          <Link href="/admin/faq" className="block hover:underline">FAQ</Link>
          <Link href="/admin/contact" className="block hover:underline">Contact</Link>
          <Link href="/admin/media" className="block hover:underline">Média</Link>
        </nav>
        <form action="/api/auth/logout" method="post" className="mt-6">
          <button className="w-full text-left text-sm bg-gray-800 px-3 py-2 rounded hover:bg-gray-700">
            Se déconnecter
          </button>
        </form>
        <nav className="space-y-2 text-sm">
          <Link href="/" className="block hover:underline">Voir le site</Link>
        </nav>
      </aside>
      <main className="p-6 bg-gray-50">{children}</main>
    </div>
  );
}
