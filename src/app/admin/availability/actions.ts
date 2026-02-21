/* eslint-disable @typescript-eslint/no-unused-vars */
"use server";

import { prisma } from "@/lib/prisma";
import { requireAdminOrSupport } from "@/lib/authServer";
import { revalidatePath } from "next/cache";
import { DayOfWeek } from "@prisma/client";

export type TimeSlot = {
  start: string;
  end: string;
};

export type WeeklySchedule = Record<DayOfWeek, TimeSlot[]>;

export type UnavailabilityData = {
  start: Date;
  end: Date;
  reason?: string;
};

export async function saveWeeklyScheduleAction(schedule: WeeklySchedule) {
  try {
    await requireAdminOrSupport();
    await prisma.$transaction(async (tx) => {
      await tx.availability.deleteMany({});

      const recordsToCreate = [];
      
      for (const day of Object.keys(schedule) as DayOfWeek[]) {
        const slots = schedule[day];
        if (slots && slots.length > 0) {
          for (const slot of slots) {
            recordsToCreate.push({
              day: day,
              startTime: slot.start,
              endTime: slot.end,
              isActive: true,
            });
          }
        }
      }

      if (recordsToCreate.length > 0) {
        await tx.availability.createMany({
          data: recordsToCreate,
        });
      }
    });

    revalidatePath("/admin/availability");
    return { success: true, message: "Semaine type enregistrée !" };
  } catch (error) {
    console.error("Erreur saveWeeklySchedule:", error);
    return { success: false, message: "Erreur lors de la sauvegarde." };
  }
}

export async function addUnavailabilityAction(start: string, end: string, reason: string) {
  try {
    await requireAdminOrSupport();

    await prisma.unavailability.create({
      data: {
        start: new Date(start),
        end: new Date(end),
        reason,
      },
    });

    revalidatePath("/admin/availability");
    return { success: true, message: "Absence ajoutée." };
  } catch (error) {
    return { success: false, message: "Erreur lors de l'ajout." };
  }
}

export async function deleteUnavailabilityAction(id: string) {
  try {
    await requireAdminOrSupport();
    await prisma.unavailability.delete({ where: { id } });
    revalidatePath("/admin/availability");
    return { success: true, message: "Absence supprimée." };
  } catch (error) {
    return { success: false, message: "Erreur lors de la suppression." };
  }
}