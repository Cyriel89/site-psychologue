"use client";

import { useState, useTransition } from "react";
import { updateHeroAction } from "./actions";
import DynamicIcon from "@/components/DynamicIcon";

type Initial = {
  name: string;
  title: string;
  subtitle: string;
  ctaLabel: string;
  ctaHref: string;
  heroImageId: string;
};

type MediaItem = { id: string; url: string; alt: string | null };

export default function HeroForm({ initial, media }: { initial: Initial; media: MediaItem[] }) {
  const [form, setForm] = useState<Initial>(initial);
  const [isPending, startTransition] = useTransition();
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFeedback(null); // Reset feedback

    startTransition(async () => {
      const result = await updateHeroAction(form);
      
      if (result.success) {
        setFeedback({ type: "success", message: result.message });
        setTimeout(() => setFeedback(null), 3000);
      } else {
        setFeedback({ type: "error", message: result.message });
      }
    });
  };

  const selectedImage = media.find((m) => m.id === form.heroImageId);

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl">
      
      {/* --- BLOC 1 : Textes Principaux --- */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <DynamicIcon name="type" className="w-5 h-5 text-indigo-600" />
          Contenu Textuel
        </h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Surtitre (Petit texte au-dessus)
            </label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
              placeholder="Ex: Psychologue à Nantes"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Titre Principal *
            </label>
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none font-bold text-gray-800"
              placeholder="Ex: Prenez soin de vous"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Sous-titre / Description
            </label>
            <textarea
              name="subtitle"
              value={form.subtitle}
              onChange={handleChange}
              rows={3}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none resize-y"
              placeholder="Une courte description..."
            />
          </div>
        </div>
      </div>

      {/* --- BLOC 2 : Bouton d'action (CTA) --- */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <DynamicIcon name="mouse-pointer" className="w-5 h-5 text-indigo-600" />
          Bouton d'Action (CTA)
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Texte du bouton</label>
            <input
              name="ctaLabel"
              value={form.ctaLabel}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Ex: Prendre Rendez-vous"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Lien du bouton</label>
            <input
              name="ctaHref"
              value={form.ctaHref}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Ex: /contact ou #rdv"
            />
          </div>
        </div>
      </div>

      {/* --- BLOC 3 : Image --- */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <DynamicIcon name="image" className="w-5 h-5 text-indigo-600" />
          Image d'illustration
        </h2>
        
        <div className="flex flex-col md:flex-row gap-6 items-start">
          <div className="flex-1 w-full">
            <select
              name="heroImageId"
              value={form.heroImageId}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
            >
              <option value="">— Aucune image —</option>
              {media.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.alt || "Image sans nom"} ({m.url.split("/").pop()})
                </option>
              ))}
            </select>
            <p className="text-xs text-gray-500 mt-2">
              Note : Ajoutez d'abord vos images dans la section "Média" pour les voir ici.
            </p>
          </div>

          {/* Prévisualisation */}
          <div className="w-full md:w-48 h-32 bg-gray-100 rounded-lg border border-gray-200 flex items-center justify-center overflow-hidden relative">
            {selectedImage ? (
              <img
                src={selectedImage.url}
                alt="Preview"
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-gray-400 text-sm">Aperçu</span>
            )}
          </div>
        </div>
      </div>

      {/* --- ACTIONS & FEEDBACK --- */}
      <div className="flex items-center gap-4 sticky bottom-4 bg-white/80 backdrop-blur-sm p-4 rounded-xl border border-gray-200 shadow-lg justify-between">
        <div className="flex-1">
          {feedback && (
            <div
              className={`text-sm font-medium px-3 py-1.5 rounded-lg inline-flex items-center gap-2 ${
                feedback.type === "success"
                  ? "bg-green-50 text-green-700 border border-green-200"
                  : "bg-red-50 text-red-700 border border-red-200"
              }`}
            >
              <DynamicIcon name={feedback.type === "success" ? "check" : "alert-circle"} className="w-4 h-4" />
              {feedback.message}
            </div>
          )}
        </div>

        <button
          type="submit"
          disabled={isPending}
          className={`px-6 py-2.5 rounded-lg font-medium text-white shadow-md transition-all flex items-center gap-2 ${
            isPending
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-indigo-600 hover:bg-indigo-700 hover:shadow-lg"
          }`}
        >
          {isPending ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Sauvegarde...
            </>
          ) : (
            <>
              <DynamicIcon name="save" className="w-4 h-4" />
              Enregistrer les modifications
            </>
          )}
        </button>
      </div>
    </form>
  );
}