"use client";

import { useState, useTransition } from "react";
import { saveContactAction, ContactFormData } from "./actions";
import DynamicIcon from "@/components/DynamicIcon";

export default function ContactForm({ initial }: { initial: ContactFormData }) {
  const [form, setForm] = useState<ContactFormData>(initial);
  const [isPending, startTransition] = useTransition();
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFeedback(null);

    startTransition(async () => {
      const res = await saveContactAction(form);
      if (res.success) {
        setFeedback({ type: "success", message: res.message });
      } else {
        setFeedback({ type: "error", message: res.message });
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl">
      
      {/* BLOC 1 : CONTENU */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <DynamicIcon name="file-text" className="w-5 h-5 text-indigo-600" />
          Contenu de la page
        </h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">Titre de la page</label>
            <input 
                name="title" 
                value={form.title} 
                onChange={handleChange} 
                className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-indigo-500 outline-none" 
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">Texte d'introduction</label>
            <textarea 
                name="intro" 
                rows={4} 
                value={form.intro} 
                onChange={handleChange} 
                className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-indigo-500 outline-none"
                placeholder="Un petit mot avant le formulaire..."
            />
          </div>
        </div>
      </div>

      {/* BLOC 2 : COORDONNÉES */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <DynamicIcon name="mail" className="w-5 h-5 text-indigo-600" />
          Coordonnées affichées
        </h2>
        <p className="text-xs text-gray-500 mb-4">
            Note : Ces informations peuvent être différentes de celles du module "Lieu". L'email ici sera celui qui recevra les messages du formulaire.
        </p>
        
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">Email de réception *</label>
            <input 
                name="email" 
                type="email" 
                value={form.email} 
                onChange={handleChange} 
                required
                className="w-full border rounded-lg p-2" 
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">Téléphone</label>
            <input 
                name="phone" 
                value={form.phone} 
                onChange={handleChange} 
                className="w-full border rounded-lg p-2" 
            />
          </div>
        </div>

        <div className="mt-4">
             <label className="block text-sm font-medium mb-1 text-gray-700">Adresse (Texte libre)</label>
             <input 
                name="address" 
                value={form.address} 
                onChange={handleChange} 
                className="w-full border rounded-lg p-2" 
             />
        </div>

        <div className="mt-4">
             <label className="block text-sm font-medium mb-1 text-gray-700">Horaires (Texte résumé)</label>
             <input 
                name="openingHours" 
                value={form.openingHours} 
                onChange={handleChange} 
                className="w-full border rounded-lg p-2" 
                placeholder="Ex: Du Lundi au Vendredi, 9h-18h"
             />
        </div>
      </div>

      {/* BLOC 3 : APPEL À L'ACTION */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <DynamicIcon name="link" className="w-5 h-5 text-indigo-600" />
          Lien de Réservation
        </h2>
        <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">URL ou Ancre</label>
            <input 
                name="booking" 
                value={form.booking} 
                onChange={handleChange} 
                className="w-full border rounded-lg p-2" 
                placeholder="Ex: https://doctolib... ou #rdv"
            />
            <p className="text-xs text-gray-500 mt-1">Lien utilisé si vous affichez un bouton "Prendre RDV" sur cette page.</p>
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
          {isPending ? "Sauvegarde..." : "Enregistrer"}
        </button>
      </div>

    </form>
  );
}