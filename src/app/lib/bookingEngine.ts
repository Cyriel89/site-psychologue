import { prisma } from "@/lib/prisma";
import { DayOfWeek } from "@prisma/client";
import { addMinutes, areIntervalsOverlapping, format, getDay, isBefore, setHours, setMinutes, startOfDay } from "date-fns";

// Intervalle de proposition des créneaux (ex: on propose 9h00, 9h30, 10h00...)
const SLOT_STEP_MINUTES = 30; 

// Mapping JS (0=Dimanche) vers Prisma DayOfWeek
const PRISMA_DAY_MAP: Record<number, DayOfWeek> = {
  0: "SUNDAY",
  1: "MONDAY",
  2: "TUESDAY",
  3: "WEDNESDAY",
  4: "THURSDAY",
  5: "FRIDAY",
  6: "SATURDAY",
};

/**
 * Récupère les créneaux disponibles pour un jour et une durée donnés.
 */
export async function getAvailableSlots(date: Date, serviceDuration: number) {
  const startOfDayDate = startOfDay(date);
  const dayOfWeek = PRISMA_DAY_MAP[getDay(date)];

  // 1. Vérifier si on est en congé (Unavailability)
  // On cherche une absence qui englobe ce jour
  const isHoliday = await prisma.unavailability.findFirst({
    where: {
      start: { lte: date }, // Commence avant ou ajd
      end: { gte: date },   // Finit après ou ajd
    },
  });

  if (isHoliday) {
    return []; // Pas de dispo si congé
  }

  // 2. Récupérer la "Semaine Type" pour ce jour (ex: LUNDI)
  const availabilities = await prisma.availability.findMany({
    where: { day: dayOfWeek, isActive: true },
  });

  if (availabilities.length === 0) {
    return []; // Pas d'horaires définis ce jour-là
  }

  // 3. Récupérer les RDV existants ce jour-là (pour éviter les conflits)
  // On prend large : du début à la fin de la journée
  const existingAppointments = await prisma.appointment.findMany({
    where: {
      startAt: {
        gte: startOfDayDate,
        lt: addMinutes(startOfDayDate, 24 * 60),
      },
      status: { not: "CANCELLED" }, // On ignore les annulés
    },
    select: { startAt: true, endAt: true },
  });

  // 4. Générer tous les créneaux possibles et filtrer
  const validSlots: string[] = [];

  // Pour chaque plage d'ouverture (ex: Matin 9-12, Aprèm 14-18)
  for (const range of availabilities) {
    // On convertit "09:00" en objet Date aujourd'hui
    const rangeStart = parseTime(date, range.startTime);
    const rangeEnd = parseTime(date, range.endTime);

    // On parcourt la plage par pas de 30min
    let cursor = rangeStart;

    while (isBefore(cursor, rangeEnd)) {
      // Calcul de la fin du RDV potentiel
      const potentialEnd = addMinutes(cursor, serviceDuration);

      // Si le RDV dépasse l'heure de fermeture, on arrête
      if (isBefore(rangeEnd, potentialEnd)) {
        break; 
      }

      // Si le créneau est dans le passé (pour aujourd'hui), on saute
      if (isBefore(cursor, new Date())) {
         cursor = addMinutes(cursor, SLOT_STEP_MINUTES);
         continue;
      }

      // Vérification de collision avec les RDV existants
      const hasConflict = existingAppointments.some((appt) =>
        areIntervalsOverlapping(
          { start: cursor, end: potentialEnd },
          { start: appt.startAt, end: appt.endAt }
        )
      );

      if (!hasConflict) {
        validSlots.push(format(cursor, "HH:mm"));
      }

      // On avance le curseur
      cursor = addMinutes(cursor, SLOT_STEP_MINUTES);
    }
  }

  return validSlots.sort();
}

// Utilitaire : transforme "09:30" en Date complète sur le jour donné
function parseTime(baseDate: Date, timeStr: string): Date {
  const [hours, minutes] = timeStr.split(":").map(Number);
  return setMinutes(setHours(baseDate, hours), minutes);
}