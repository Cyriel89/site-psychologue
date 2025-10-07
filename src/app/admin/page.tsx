// src/app/admin/page.tsx
import { requireAdminOrSupport } from "@/lib/authServer";
import { redirect } from "next/navigation";

export default async function AdminHomePage() {
  const user = await requireAdminOrSupport();
  console.log("AdminHomePage user:", user);
  if (!user) {
    // Si pas connecté ou pas autorisé → redirection immédiate
    redirect("/");
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl my-16 font-bold">Bienvenue dans l’administration</h1>
      <p className="text-gray-700">
        Connecté en tant que <span className="font-semibold">{user.user?.firstName ?? user.user?.email}</span> 
        {" "}avec le rôle <span className="uppercase">{user.user?.role}</span>.
      </p>
    </div>
  );
}
