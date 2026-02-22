/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useTransition } from "react";
import { format as formatDate, differenceInHours, isSameDay } from "date-fns";
import { fr } from "date-fns/locale";
import DynamicIcon from "@/components/DynamicIcon";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { cancelAppointmentAction, updateAppointmentAction } from "./actions";
import { getSlotsAction } from "../../(site)/book/actions"; // On réutilise ta fonction !

export default function AppointmentCard({ apt }: { apt: any }) {
  const [isEditing, setIsEditing] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  
  // États du formulaire
  const [format, setFormat] = useState<"FACE_TO_FACE" | "VISIO">(apt.format);
  const [notes, setNote] = useState(apt.notes || "");
  const [date, setDate] = useState<Date>(new Date(apt.startAt));
  const [slots, setSlots] = useState<string[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [slotsLoading, setSlotsLoading] = useState(false);

  const [isPending, startTransition] = useTransition();

  // Règle des 48h
  const hoursLeft = differenceInHours(new Date(apt.startAt), new Date());
  const canEdit = hoursLeft >= 48;

  // Charger les créneaux si on affiche le calendrier
  const handleDateChange = (val: any) => {
    const newDate = val instanceof Date ? val : val[0];
    setDate(newDate);
    setSelectedSlot(null);
    setSlotsLoading(true);
    
    startTransition(async () => {
      const res = await getSlotsAction(newDate.toISOString(), apt.serviceId);
      let availableSlots = res.slots || [];
      
      // Si on clique sur la date actuelle de la séance, on rajoute l'heure actuelle 
      // car le système la considère comme "occupée" par nous-même !
      if (isSameDay(newDate, new Date(apt.startAt))) {
        const currentSlot = formatDate(new Date(apt.startAt), "HH:mm");
        if (!availableSlots.includes(currentSlot)) {
          availableSlots = [currentSlot, ...availableSlots].sort();
        }
      }
      setSlots(availableSlots);
      setSlotsLoading(false);
    });
  };

  const handleUpdate = () => {
    startTransition(async () => {
      const res = await updateAppointmentAction(apt.id, {
        format,
        notes,
        newDate: showCalendar ? date : undefined,
        newTime: showCalendar && selectedSlot ? selectedSlot : undefined,
      });
      if (res.success) setIsEditing(false);
      else alert(res.message);
    });
  };

  const handleCancel = () => {
    if (!confirm("Êtes-vous sûr de vouloir annuler cette séance ? Cette action est irréversible.")) return;
    startTransition(async () => {
      const res = await cancelAppointmentAction(apt.id);
      if (!res.success) alert(res.message);
    });
  };

  // --- VUE ÉDITION ---
  if (isEditing && canEdit) {
    return (
      <div className="bg-white p-6 rounded-2xl shadow-md border border-indigo-200 transition-all">
        <h3 className="text-xl font-medium text-stone-800 mb-4">Modifier ma séance</h3>
        
        <div className="space-y-4">
          {/* Format */}
          <div>
            <label className="block text-sm font-semibold text-stone-600 mb-2">Lieu de la séance</label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="radio" name="format" checked={format === "FACE_TO_FACE"} onChange={() => setFormat("FACE_TO_FACE")} className="text-indigo-600" />
                <span className="text-sm">Au cabinet</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="radio" name="format" checked={format === "VISIO"} onChange={() => setFormat("VISIO")} className="text-indigo-600" />
                <span className="text-sm">En visio</span>
              </label>
            </div>
          </div>

          {/* notes */}
          <div>
            <label className="block text-sm font-semibold text-stone-600 mb-2">notes au praticien</label>
            <textarea rows={2} value={notes} onChange={e => setNote(e.target.value)} className="w-full border border-stone-200 rounded-lg p-2 text-sm focus:ring-2 focus:ring-indigo-200" />
          </div>

          {/* Changer la date */}
          <div className="border-t border-stone-100 pt-4">
            {!showCalendar ? (
              <button type="button" onClick={() => { setShowCalendar(true); handleDateChange(date); }} className="text-indigo-600 text-sm hover:underline font-medium">
                Changer la date ou l&apos;heure de la séance
              </button>
            ) : (
              <div className="bg-stone-50 p-4 rounded-xl">
                <p className="text-sm font-semibold text-stone-600 mb-2">Nouvelle date et heure :</p>
                <div className="calendar-wrapper mb-4">
                  <Calendar onChange={handleDateChange} value={date} minDate={new Date()} locale="fr-FR" className="w-full border-none rounded-lg text-sm" />
                </div>
                {slotsLoading ? <p className="text-sm text-stone-500">Chargement...</p> : (
                  <div className="flex flex-wrap gap-2">
                    {slots.map(s => (
                      <button key={s} onClick={() => setSelectedSlot(s)} className={`px-3 py-1 text-sm rounded-lg border ${selectedSlot === s ? "bg-indigo-600 text-white border-indigo-600" : "bg-white border-stone-200"}`}>
                        {s}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t border-stone-100">
            <button onClick={() => setIsEditing(false)} className="px-4 py-2 text-sm text-stone-500 hover:text-stone-700">Annuler</button>
            <button onClick={handleUpdate} disabled={isPending || (showCalendar && !selectedSlot)} className="px-4 py-2 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50">
              {isPending ? "Enregistrement..." : "Enregistrer"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // --- VUE NORMALE (Lecture) ---
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-stone-100 flex flex-col gap-4 transition-all hover:shadow-md">
      <div className="flex flex-col md:flex-row justify-between md:items-start gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-3 mb-2">
            <h3 className="text-xl font-medium text-stone-800">{apt.service.title}</h3>
            {apt.format === "VISIO" ? (
              <span className="bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 border border-indigo-100">
                <span>💻</span> En téléconsultation
              </span>
            ) : (
              <span className="bg-stone-100 text-stone-700 px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 border border-stone-200">
                <span>☕</span> Au cabinet
              </span>
            )}
          </div>

          <div className="text-stone-500 flex items-center gap-2 mb-3">
            <span className="w-2 h-2 rounded-full bg-indigo-300"></span>
            <span className="capitalize font-medium">{formatDate(new Date(apt.startAt), "EEEE d MMMM yyyy", { locale: fr })}</span>
            <span>à {formatDate(new Date(apt.startAt), "HH'h'mm")}</span>
          </div>

          {apt.format === "VISIO" && (
            <div className="text-sm bg-blue-50/50 text-blue-800 p-3 rounded-xl border border-blue-100 mb-3">
              Le lien de connexion à la vidéo apparaîtra ici environ 10 minutes avant le début.
            </div>
          )}

          {apt.notes && (
            <p className="text-sm text-stone-400 italic border-l-2 border-stone-200 pl-3">
              notes : &quot;{apt.notes}&quot;
            </p>
          )}
        </div>
        
        {/* Badges & Actions */}
        <div className="flex flex-col items-end gap-2">
          <div className="px-4 py-2 rounded-full text-sm font-medium w-fit bg-emerald-50 text-emerald-700 border border-emerald-100">
            Confirmé
          </div>
          
          {canEdit ? (
            <div className="flex gap-2 mt-2">
              <button onClick={() => setIsEditing(true)} className="text-sm text-indigo-600 hover:underline px-2">Modifier</button>
              <button onClick={handleCancel} disabled={isPending} className="text-sm text-red-500 hover:underline px-2">Annuler</button>
            </div>
          ) : (
            <div className="flex items-center gap-1 mt-2 text-xs text-amber-600 bg-amber-50 px-3 py-1.5 rounded-lg">
              <DynamicIcon name="lock" className="w-3 h-3" />
              Modification impossible (-48h)
            </div>
          )}
        </div>
      </div>
    </div>
  );
}