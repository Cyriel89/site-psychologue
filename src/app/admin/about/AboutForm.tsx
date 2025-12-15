"use client";

import { useState, useTransition } from "react";
import { updateAboutAction } from "./actions";
import DynamicIcon from "@/components/DynamicIcon";

type Initial = {
  title: string;
  goal: string;
  mission: string;
  presentation: string;
};

export default function AboutForm({ initial }: { initial: Initial }) {
  const [form, setForm] = useState<Initial>(initial);
  const [isPending, startTransition] = useTransition();
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFeedback(null);

    startTransition(async () => {
      const result = await updateAboutAction(form);
      if (result.success) {
        setFeedback({ type: "success", message: result.message });
        setTimeout(() => setFeedback(null), 3000);
      } else {
        setFeedback({ type: "error", message: result.message });
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl">
      
      {/* Contenu Textuel */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <DynamicIcon name="file-text" className="w-5 h-5 text-indigo-600" />
          Présentation
        </h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Titre de la section</label>
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
              placeholder="Ex: Qui suis-je ?"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Présentation</label>
            <textarea
              name="presentation"
              value={form.presentation}
              onChange={handleChange}
              rows={8}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
              placeholder="Rédigez votre présentation ici..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Mission</label>
            <textarea
              name="mission"
              value={form.mission}
              onChange={handleChange}
              rows={8}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
              placeholder="Rédigez votre mission ici..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Valeurs</label>
            <textarea
              name="goal"
              value={form.goal}
              onChange={handleChange}
              rows={8}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
              placeholder="Rédigez vos valeurs ici..."
            />
          </div>
        </div>
      </div>

      {/* Barre d'action Sticky */}
      <div className="flex items-center gap-4 sticky bottom-4 bg-white/80 backdrop-blur-sm p-4 rounded-xl border border-gray-200 shadow-lg justify-between z-10">
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