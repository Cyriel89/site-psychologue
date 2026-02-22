import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { isFuture } from "date-fns";
import DynamicIcon from "@/components/DynamicIcon";
import Link from "next/link";
import AppointmentCard from "./AppointmentCard";

export default async function MesRendezVousPage() {
  const session = await getSession();

  if (!session || !session.userId) {
    redirect("/login");
  }

  // On récupère les RDV qui NE SONT PAS annulés
  const appointments = await prisma.appointment.findMany({
    where: { 
      userId: session.userId,
      status: { not: "CANCELLED" } // On exclut les RDV annulés
    },
    include: { 
      service: true 
    },
    orderBy: { 
      startAt: "asc" 
    },
  });

  const safeAppointments = appointments.map(apt => ({
    ...apt,
    price: Number(apt.price), // Conversion du Decimal de Prisma en Nombre JS
    service: {
      ...apt.service,
      priceAmount: Number(apt.service.priceAmount) // Si priceAmount est aussi un Decimal
    }
  }));

  const upcomingAppointments = safeAppointments.filter(apt => isFuture(new Date(apt.startAt)));
  const pastAppointments = safeAppointments.filter(apt => !isFuture(new Date(apt.startAt)));

  return (
    <div className="max-w-4xl mx-auto py-12 px-6 min-h-[60vh]">
      <div className="mb-10 border-b border-stone-100 pb-8">
        <h1 className="text-3xl font-serif text-stone-800 mb-3 tracking-wide">
          Mes séances
        </h1>
        <p className="text-stone-500">
          Gérez vos moments de consultation et consultez votre historique.
        </p>
      </div>
      
      {/* SECTION : Rendez-vous à venir */}
      <div className="mb-16">
        <h2 className="text-xl font-serif text-stone-700 mb-6 flex items-center gap-2">
          <DynamicIcon name="calendar" className="w-5 h-5 text-indigo-400" />
          À venir
        </h2>

        {upcomingAppointments.length === 0 ? (
          <div className="bg-stone-50 rounded-2xl p-10 text-center text-stone-500 border border-stone-100 shadow-inner">
            <p className="text-lg mb-4">Vous n&apos;avez aucune séance programmée.</p>
            <Link href="/book" className="inline-block px-6 py-3 bg-indigo-50 text-indigo-700 rounded-lg hover:bg-indigo-100 transition-colors font-medium">
              Réserver un moment pour soi
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {upcomingAppointments.map((apt) => (
              <AppointmentCard key={apt.id} apt={apt} />
            ))}
          </div>
        )}
      </div>

      {/* SECTION : Historique (Simplifié, pas de carte éditable ici) */}
      {pastAppointments.length > 0 && (
        <div>
          <h2 className="text-xl font-serif text-stone-700 mb-6 flex items-center gap-2">
            <DynamicIcon name="clock" className="w-5 h-5 text-stone-400" />
            Historique
          </h2>
          <div className="space-y-3 opacity-75">
            {pastAppointments.map((apt) => (
              <div key={apt.id} className="bg-stone-50 p-5 rounded-xl border border-stone-100 flex justify-between items-center">
                <span className="font-medium text-stone-600">{apt.service.title}</span>
                <span className="text-stone-500 text-sm">
                  {new Date(apt.startAt).toLocaleDateString("fr-FR")}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}