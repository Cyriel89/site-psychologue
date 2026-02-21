import { prisma } from "@/lib/prisma";
import BookingForm from "./BookingForm";

export const dynamic = "force-dynamic";

export default async function BookPage() {
  // On récupère les services actifs pour que le client choisisse
  const services = await prisma.service.findMany({
    where: { visible: true },
    orderBy: { order: "asc" },
  });

  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold text-center mb-2">Prendre Rendez-vous</h1>
      <p className="text-center text-gray-500 mb-10">Choisissez une prestation et un créneau qui vous convient.</p>
      
      <BookingForm services={services} />
    </div>
  );
}