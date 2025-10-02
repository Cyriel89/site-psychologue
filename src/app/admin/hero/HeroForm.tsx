// src/app/admin/hero/HeroForm.tsx
"use client";

import { useState } from "react";

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
  const [status, setStatus] = useState<"idle"|"saving"|"ok"|"error">("idle");
  const [error, setError] = useState("");

  const update = (e: React.ChangeEvent<HTMLInputElement|HTMLTextAreaElement|HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("saving");
    setError("");

    try {
      const res = await fetch("/api/admin/hero", {
        method: "POST",
        headers: { "Content-Type":"application/json" },
        body: JSON.stringify({
          name: form.name,
          title: form.title,
          subtitle: form.subtitle,
          ctaLabel: form.ctaLabel,
          ctaHref: form.ctaHref,
          heroImageId: form.heroImageId || null,
        }),
      });
      if (!res.ok) {
        const payload = await res.json().catch(()=>({}));
        setError(payload.message || "Erreur lors de l’enregistrement.");
        setStatus("error");
        return;
      }
      setStatus("ok");
    } catch {
      setError("Erreur réseau.");
      setStatus("error");
    }
  };

  return (
    <form onSubmit={onSubmit} className="max-w-2xl space-y-4">
      <div>
        <label className="block text-sm mb-1">Nom (petit titre au-dessus)</label>
        <input name="name" value={form.name} onChange={update}
               className="w-full border rounded p-2" required />
      </div>

      <div>
        <label className="block text-sm mb-1">Titre principal</label>
        <input name="title" value={form.title} onChange={update}
               className="w-full border rounded p-2" required />
      </div>

      <div>
        <label className="block text-sm mb-1">Sous-titre</label>
        <textarea name="subtitle" value={form.subtitle} onChange={update}
                  className="w-full border rounded p-2" rows={3} />
      </div>

        <div>
          <label className="block text-sm mb-1">CTA Label</label>
          <input name="ctaLabel" value={form.ctaLabel} onChange={update}
                 className="w-full border rounded p-2" />
        </div>

      <div>
        <label className="block text-sm mb-1">Image (Media)</label>
        <select name="heroImageId" value={form.heroImageId} onChange={update}
                className="w-full border rounded p-2">
          <option value="">— Aucune —</option>
          {media.map(m => (
            <option key={m.id} value={m.id}>
              {m.alt ?? m.url}
            </option>
          ))}
        </select>
        {/* Optionnel : prévisualisation */}
        {form.heroImageId && (
          <div className="mt-3">
            {/* on retrouve l’url à partir de la liste */}
            {/* petite preview si tu veux */}
            <img
              src={media.find(mi => mi.id === form.heroImageId)?.url}
              alt={media.find(mi => mi.id === form.heroImageId)?.alt ?? ""}
              className="max-h-40 rounded border"
            />
          </div>
        )}
      </div>

      <div className="pt-2">
        <button
          className="px-5 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-60"
          disabled={status === "saving"}
        >
          {status === "saving" ? "Enregistrement..." : "Enregistrer"}
        </button>
        {status === "ok" && <span className="ml-3 text-green-600">Sauvegardé ✅</span>}
        {status === "error" && <span className="ml-3 text-red-600">{error}</span>}
      </div>
    </form>
  );
}
