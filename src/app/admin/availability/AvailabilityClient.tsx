/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useTransition } from "react";
import { DayOfWeek } from "@prisma/client";
import { saveWeeklyScheduleAction, addUnavailabilityAction, deleteUnavailabilityAction, WeeklySchedule, TimeSlot } from "./actions";
import DynamicIcon from "@/components/DynamicIcon";

const DAY_LABELS: Record<DayOfWeek, string> = {
  MONDAY: "Lundi",
  TUESDAY: "Mardi",
  WEDNESDAY: "Mercredi",
  THURSDAY: "Jeudi",
  FRIDAY: "Vendredi",
  SATURDAY: "Samedi",
  SUNDAY: "Dimanche",
};

const ORDERED_DAYS: DayOfWeek[] = ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY", "SUNDAY"];

export default function AvailabilityClient({ 
  initialSchedule, 
  unavailabilities 
}: { 
  initialSchedule: WeeklySchedule; 
  unavailabilities: any[] 
}) {
  // --- STATE SEMAINE TYPE ---
  const [schedule, setSchedule] = useState<WeeklySchedule>(initialSchedule);
  
  // --- STATE ABSENCES ---
  const [newOffStart, setNewOffStart] = useState("");
  const [newOffEnd, setNewOffEnd] = useState("");
  const [newOffReason, setNewOffReason] = useState("");

  const [isPending, startTransition] = useTransition();
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);

  // --- LOGIQUE SEMAINE ---

  const addSlot = (day: DayOfWeek) => {
    const newSlot: TimeSlot = { start: "09:00", end: "17:00" };
    setSchedule(prev => ({
      ...prev,
      [day]: [...(prev[day] || []), newSlot]
    }));
  };

  const removeSlot = (day: DayOfWeek, index: number) => {
    setSchedule(prev => ({
      ...prev,
      [day]: prev[day].filter((_, i) => i !== index)
    }));
  };

  const updateSlot = (day: DayOfWeek, index: number, field: keyof TimeSlot, value: string) => {
    setSchedule(prev => {
      const slots = [...prev[day]];
      slots[index] = { ...slots[index], [field]: value };
      return { ...prev, [day]: slots };
    });
  };

  const handleSaveWeek = () => {
    setFeedback(null);
    startTransition(async () => {
      const res = await saveWeeklyScheduleAction(schedule);
      setFeedback({ type: res.success ? "success" : "error", message: res.message });
      if(res.success) setTimeout(() => setFeedback(null), 3000);
    });
  };

  // --- LOGIQUE ABSENCES ---

  const handleAddUnavailability = () => {
    if (!newOffStart || !newOffEnd) return;
    startTransition(async () => {
      const res = await addUnavailabilityAction(newOffStart, newOffEnd, newOffReason);
      if (res.success) {
        setNewOffStart("");
        setNewOffEnd("");
        setNewOffReason("");
      } else {
        alert(res.message);
      }
    });
  };

  const handleDeleteUnavailability = (id: string) => {
    if(!confirm("Supprimer cette absence ?")) return;
    startTransition(async () => {
      await deleteUnavailabilityAction(id);
    });
  };

  return (
    <div className="space-y-8">
      
      {/* SECTION 1 : SEMAINE TYPE */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-6">
            <div>
                <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                    <DynamicIcon name="calendar" className="w-5 h-5 text-indigo-600" />
                    Semaine Type
                </h2>
                <p className="text-sm text-gray-500">Définissez vos créneaux récurrents habituels.</p>
            </div>
            
            <button 
                onClick={handleSaveWeek}
                disabled={isPending}
                className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 font-medium flex items-center gap-2 shadow-sm"
            >
                {isPending ? "Sauvegarde..." : "Enregistrer la semaine"}
            </button>
        </div>
        
        {feedback && (
            <div className={`mb-4 p-3 rounded-lg text-sm flex items-center gap-2 ${feedback.type === "success" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}>
                <DynamicIcon name={feedback.type === "success" ? "check" : "alert-circle"} className="w-4 h-4" />
                {feedback.message}
            </div>
        )}

        <div className="space-y-4">
            {ORDERED_DAYS.map(day => {
                const slots = schedule[day] || [];
                const isActive = slots.length > 0;

                return (
                    <div key={day} className={`border rounded-lg p-4 transition-colors ${isActive ? "bg-white border-gray-200" : "bg-gray-50 border-gray-100 opacity-70"}`}>
                        <div className="flex flex-col md:flex-row md:items-start gap-4">
                            
                            {/* Jour + Switch */}
                            <div className="w-32 pt-2 flex items-center justify-between md:justify-start gap-3">
                                <span className={`font-medium ${isActive ? "text-gray-900" : "text-gray-400"}`}>
                                    {DAY_LABELS[day]}
                                </span>
                                {slots.length === 0 && (
                                    <button onClick={() => addSlot(day)} className="text-xs text-indigo-600 hover:underline">
                                        + Activer
                                    </button>
                                )}
                            </div>

                            {/* Créneaux */}
                            <div className="flex-1 space-y-3">
                                {slots.map((slot, index) => (
                                    <div key={index} className="flex items-center gap-2">
                                        <input 
                                            type="time" 
                                            value={slot.start} 
                                            onChange={(e) => updateSlot(day, index, "start", e.target.value)}
                                            className="border rounded px-2 py-1 text-sm bg-white focus:ring-2 focus:ring-indigo-500 outline-none"
                                        />
                                        <span className="text-gray-400">à</span>
                                        <input 
                                            type="time" 
                                            value={slot.end} 
                                            onChange={(e) => updateSlot(day, index, "end", e.target.value)}
                                            className="border rounded px-2 py-1 text-sm bg-white focus:ring-2 focus:ring-indigo-500 outline-none"
                                        />
                                        <button 
                                            onClick={() => removeSlot(day, index)}
                                            className="p-1 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded"
                                            title="Retirer ce créneau"
                                        >
                                            <DynamicIcon name="x" className="w-4 h-4" />
                                        </button>
                                    </div>
                                ))}
                                {isActive && (
                                    <button onClick={() => addSlot(day)} className="text-xs flex items-center gap-1 text-gray-500 hover:text-indigo-600 mt-2">
                                        <DynamicIcon name="plus" className="w-3 h-3" />
                                        Ajouter une pause / coupure
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
      </div>

      {/* SECTION 2 : CONGÉS & EXCEPTIONS */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
         <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
            <DynamicIcon name="coffee" className="w-5 h-5 text-orange-500" />
            Congés & Jours fériés
         </h2>
         <p className="text-sm text-gray-500 mb-6">Ajoutez ici vos vacances ou jours d&apos;absence ponctuels. Le calendrier bloquera ces dates.</p>

         {/* Formulaire ajout */}
         <div className="bg-orange-50 p-4 rounded-lg border border-orange-100 flex flex-col md:flex-row gap-4 items-end mb-6">
             <div className="flex-1 w-full">
                <label className="block text-xs font-semibold text-orange-800 mb-1">Début absence</label>
                <input 
                    type="datetime-local" 
                    value={newOffStart}
                    onChange={(e) => setNewOffStart(e.target.value)}
                    className="w-full border border-orange-200 rounded px-3 py-2 text-sm focus:ring-2 focus:ring-orange-500 outline-none"
                />
             </div>
             <div className="flex-1 w-full">
                <label className="block text-xs font-semibold text-orange-800 mb-1">Fin absence</label>
                <input 
                    type="datetime-local" 
                    value={newOffEnd}
                    onChange={(e) => setNewOffEnd(e.target.value)}
                    className="w-full border border-orange-200 rounded px-3 py-2 text-sm focus:ring-2 focus:ring-orange-500 outline-none"
                />
             </div>
             <div className="flex-1 w-full">
                <label className="block text-xs font-semibold text-orange-800 mb-1">Motif (optionnel)</label>
                <input 
                    type="text" 
                    placeholder="Ex: Vacances été"
                    value={newOffReason}
                    onChange={(e) => setNewOffReason(e.target.value)}
                    className="w-full border border-orange-200 rounded px-3 py-2 text-sm focus:ring-2 focus:ring-orange-500 outline-none"
                />
             </div>
             <button 
                onClick={handleAddUnavailability}
                disabled={isPending || !newOffStart || !newOffEnd}
                className="bg-orange-500 text-white px-4 py-2 rounded font-medium text-sm hover:bg-orange-600 disabled:opacity-50"
             >
                Ajouter
             </button>
         </div>

         {/* Liste des absences */}
         <div className="space-y-2">
            {unavailabilities.length === 0 && <p className="text-sm text-gray-400 italic">Aucune absence programmée.</p>}
            {unavailabilities.map((item) => (
                <div key={item.id} className="flex items-center justify-between p-3 border rounded hover:bg-gray-50">
                    <div>
                        <div className="font-medium text-gray-800">
                            {new Date(item.start).toLocaleDateString()} {new Date(item.start).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} 
                            <span className="mx-2 text-gray-400">➔</span>
                            {new Date(item.end).toLocaleDateString()} {new Date(item.end).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                        </div>
                        {item.reason && <div className="text-xs text-gray-500">{item.reason}</div>}
                    </div>
                    <button 
                        onClick={() => handleDeleteUnavailability(item.id)}
                        disabled={isPending}
                        className="text-red-600 hover:bg-red-50 p-2 rounded"
                    >
                        <DynamicIcon name="trash-2" className="w-4 h-4" />
                    </button>
                </div>
            ))}
         </div>

      </div>

    </div>
  );
}