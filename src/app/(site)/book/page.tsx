import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import BookingForm from "./BookingForm";
import { getSession } from "@/lib/session"; 

export default async function BookPage() {
  // 1. On vérifie si l'utilisateur est connecté
  const session = await getSession();

  // S'il n'y a pas de session valide, direction la connexion
  if (!session || !session.userId) {
    redirect("/login");
  }

  // 2. On récupère les prestations
  const services = await prisma.service.findMany({
    orderBy: { order: 'asc' }
  });

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="max-w-3xl mx-auto mb-8 text-center">
        <h1 className="text-3xl font-serif text-stone-800 mb-2">Prendre rendez-vous</h1>
        <p className="text-stone-500">Choisissez la prestation et le moment qui vous conviennent.</p>
      </div>
      
      <BookingForm services={services} />
    </div>
  );
}