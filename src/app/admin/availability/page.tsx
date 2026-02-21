import { prisma } from "@/lib/prisma";
import { requireAdminOrSupport } from "@/lib/authServer";
import AvailabilityClient from "./AvailabilityClient";
import { WeeklySchedule } from "./actions";

export default async function AdminAvailabilityPage() {
  await requireAdminOrSupport();

  const availabilities = await prisma.availability.findMany();
  
  const schedule: WeeklySchedule = {
    MONDAY: [], TUESDAY: [], WEDNESDAY: [], THURSDAY: [], FRIDAY: [], SATURDAY: [], SUNDAY: []
  };

  availabilities.forEach(av => {
    if (schedule[av.day]) {
      schedule[av.day].push({ start: av.startTime, end: av.endTime });
    }
  });

  const unavailabilities = await prisma.unavailability.findMany({
    where: {
      end: { gte: new Date() }
    },
    orderBy: { start: "asc" }
  });

  return (
    <div className="max-w-5xl mx-auto pb-10">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Disponibilités & Horaires</h1>
        <p className="text-gray-500 mt-1">
          Configurez ici les créneaux où le calendrier pourra proposer des rendez-vous.
        </p>
      </div>

      <AvailabilityClient 
        initialSchedule={schedule} 
        unavailabilities={unavailabilities} 
      />
    </div>
  );
}