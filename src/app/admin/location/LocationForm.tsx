"use client";

import { useState, useTransition } from "react";
import { saveLocationAction, LocationFormData, OpeningHoursData } from "./actions";
import DynamicIcon from "@/components/DynamicIcon";

export default function LocationForm({ initial }: { initial: LocationFormData }) {
  const [form, setForm] = useState<LocationFormData>(initial);
  const [isPending, startTransition] = useTransition();
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleHoursChange = (day: keyof OpeningHoursData, value: string) => {
    setForm((prev) => ({
      ...prev,
      openingHours: { ...prev.openingHours, [day]: value },
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFeedback(null);

    startTransition(async () => {
      const res = await saveLocationAction(form);
      if (res.success) {
        setFeedback({ type: "success", message: res.message });
      } else {
        setFeedback({ type: "error", message: res.message });
      }
    });
  };

  const days: (keyof OpeningHoursData)[] = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"];

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-5xl">
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* GAUCHE : INFOS GÉNÉRALES */}
        <div className="space-y-6">
          
          {/* Carte 1 : Titres */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <DynamicIcon name="type" className="w-5 h-5 text-indigo-600" />
              Titres de la section
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Titre principal</label>
                <input name="title" value={form.title} onChange={handleChange} className="w-full border rounded-lg p-2" placeholder="Où me trouver ?" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Sous-titre</label>
                <input name="subtitle" value={form.subtitle} onChange={handleChange} className="w-full border rounded-lg p-2" placeholder="Cabinet au centre ville..." />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Notes / Instructions</label>
                <textarea name="notes" rows={3} value={form.notes} onChange={handleChange} className="w-full border rounded-lg p-2" placeholder="Code porte, étage, parking..." />
              </div>
            </div>
          </div>

          {/* Carte 2 : Adresse & GPS */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <DynamicIcon name="map-pin" className="w-5 h-5 text-indigo-600" />
              Adresse & Coordonnées
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Adresse (Ligne 1)</label>
                <input name="addressLine1" value={form.addressLine1} onChange={handleChange} className="w-full border rounded-lg p-2" placeholder="12 rue de la Paix" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Complément (Ligne 2)</label>
                <input name="addressLine2" value={form.addressLine2} onChange={handleChange} className="w-full border rounded-lg p-2" placeholder="Bâtiment B" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                 <div>
                    <label className="block text-sm font-medium mb-1">Code Postal</label>
                    <input name="postalCode" value={form.postalCode} onChange={handleChange} className="w-full border rounded-lg p-2" />
                 </div>
                 <div>
                    <label className="block text-sm font-medium mb-1">Ville</label>
                    <input name="city" value={form.city} onChange={handleChange} className="w-full border rounded-lg p-2" />
                 </div>
              </div>
              
              <hr className="border-gray-100 my-2" />
              
              <div className="grid grid-cols-2 gap-4">
                 <div>
                    <label className="block text-sm font-medium mb-1">Latitude</label>
                    <input name="latitude" type="number" step="any" value={form.latitude} onChange={handleChange} className="w-full border rounded-lg p-2 bg-gray-50" placeholder="47.218" />
                 </div>
                 <div>
                    <label className="block text-sm font-medium mb-1">Longitude</label>
                    <input name="longitude" type="number" step="any" value={form.longitude} onChange={handleChange} className="w-full border rounded-lg p-2 bg-gray-50" placeholder="-1.553" />
                 </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Lien Google Maps / Waze</label>
                <input name="mapUrl" value={form.mapUrl} onChange={handleChange} className="w-full border rounded-lg p-2" placeholder="https://maps.google.com/..." />
              </div>
            </div>
          </div>

        </div>

        {/* DROITE : HORAIRES */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-fit">
            <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <DynamicIcon name="clock" className="w-5 h-5 text-indigo-600" />
              Horaires d'ouverture
            </h2>
            <div className="space-y-3 bg-gray-50 p-4 rounded-lg">
                {days.map(day => (
                    <div key={day} className="grid grid-cols-[100px_1fr] items-center gap-2">
                        <label className="text-sm font-medium text-gray-600">{day}</label>
                        <input 
                            value={form.openingHours[day]} 
                            onChange={(e) => handleHoursChange(day, e.target.value)}
                            className="w-full border border-gray-200 rounded px-3 py-1.5 text-sm focus:ring-1 focus:ring-indigo-500 outline-none"
                            placeholder="ex: 9h00 - 18h00" 
                        />
                    </div>
                ))}
            </div>
            <p className="text-xs text-gray-400 mt-4 text-center">
                Laissez vide ou écrivez "Fermé" pour les jours de repos.
            </p>
        </div>

      </div>

      {/* FOOTER ACTIONS */}
      <div className="flex items-center gap-4 bg-white p-4 rounded-xl border border-gray-200 shadow-sm justify-between sticky bottom-4">
        <div className="flex-1">
          {feedback && (
            <div className={`text-sm font-medium px-3 py-1.5 rounded-lg inline-flex items-center gap-2 ${
                feedback.type === "success" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"
              }`}>
              <DynamicIcon name={feedback.type === "success" ? "check" : "alert-circle"} className="w-4 h-4" />
              {feedback.message}
            </div>
          )}
        </div>

        <button
          type="submit"
          disabled={isPending}
          className={`px-6 py-2.5 rounded-lg font-medium text-white shadow-md transition-all flex items-center gap-2 ${
            isPending ? "bg-gray-400 cursor-not-allowed" : "bg-indigo-600 hover:bg-indigo-700"
          }`}
        >
          {isPending ? "Sauvegarde..." : "Enregistrer les infos"}
        </button>
      </div>

    </form>
  );
}