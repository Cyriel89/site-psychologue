"use client";

import { useState } from "react";

type AboutForm = {
  title: string;
  presentation: string;
  mission: string;
  goal: string;
};

export default function AdminAbout({
  initialAbout
}: {
  initialAbout: AboutForm;
}) {
  const [form, setForm] = useState<AboutForm>(initialAbout);
  const [status, setStatus] = useState<"idle" | "saving" | "ok" | "error">("idle");
  const [err, setErr] = useState("");

  const update = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const onSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("saving");
    setErr("");
    try {
      const res = await fetch("/api/admin/about/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const payload = await res.json().catch(() => ({}));
      if (!res.ok || !payload.ok) {
        setErr(typeof payload.message === "string" ? payload.message : "Erreur d'enregistrement.");
        setStatus("error");
        return;
      }
      setStatus("ok");
    } catch {
      setErr("Erreur réseau.");
      setStatus("error");
    }
  };

  return (
    <div className="max-w-4xl bg-white border rounded-lg p-6">
      <h1 className="text-xl font-semibold mb-4">À propos — Administration</h1>
      <form onSubmit={onSave} className="space-y-6">
        <div>
          <label className="block text-sm mb-1">Titre</label>
          <input
            name="title"
            value={form.title}
            onChange={update}
            className="w-full border rounded p-2"
            placeholder="À propos"
          />
        </div>

        <div>
          <label className="block text-sm mb-1">Présentation</label>
          <textarea
            name="presentation"
            value={form.presentation}
            onChange={update}
            rows={4}
            className="w-full border rounded p-2"
            placeholder="Texte d’introduction…"
          />
        </div>

        <div>
          <label className="block text-sm mb-1">Mission</label>
          <textarea
            name="mission"
            value={form.mission}
            onChange={update}
            rows={4}
            className="w-full border rounded p-2"
            placeholder="Mission…"
          />
        </div>

        <div>
          <label className="block text-sm mb-1">Objectif</label>
          <textarea
            name="goal"
            value={form.goal}
            onChange={update}
            rows={4}
            className="w-full border rounded p-2"
            placeholder="Objectif…"
          />
        </div>

        <div className="flex justify-end gap-3">
          <button
            type="submit"
            className="px-5 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-60"
            disabled={status === "saving"}
          >
            {status === "saving" ? "Enregistrement..." : "Enregistrer"}
          </button>
        </div>

        {status === "ok" && <p className="text-green-600">Sauvegardé ✅</p>}
        {status === "error" && <p className="text-red-600">{err}</p>}
      </form>
    </div>
  );
}