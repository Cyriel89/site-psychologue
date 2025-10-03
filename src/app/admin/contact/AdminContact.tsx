// src/app/admin/contact/AdminContact.tsx
"use client";

import { useState } from "react";

type ContactAdminEditable = {
  title: string;
  intro: string;
  email: string;
  phone: string;
  address: string;
  openingHours: string;
  booking: string;
};

export default function AdminContact({ initial }: { initial: ContactAdminEditable }) {
  const [form, setForm] = useState<ContactAdminEditable>(initial);
  const [status, setStatus] = useState<"idle" | "saving" | "ok" | "error">("idle");
  const [err, setErr] = useState("");

  const update = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  };

  const onSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("saving");
    setErr("");
    try {
      const res = await fetch("/api/admin/contact/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contact: form }),
      });
      const payload = await res.json().catch(() => ({}));
      if (!res.ok || !payload.ok) {
        setStatus("error");
        setErr(payload.message || "Erreur de sauvegarde.");
        return;
      }
      setStatus("ok");
    } catch {
      setStatus("error");
      setErr("Erreur réseau.");
    }
  };

  return (
    <main className="max-w-3xl mx-auto bg-white rounded-lg border p-6">
      <h1 className="text-xl font-semibold mb-4">Contact — Administration</h1>

      <form onSubmit={onSave} className="space-y-5">
        <div>
          <label className="block text-sm mb-1">Intro (au-dessus du formulaire)</label>
          <textarea name="intro" rows={3} value={form.intro} onChange={update} className="w-full border rounded p-2" />
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm mb-1">Titre</label>
            <input name="title" value={form.title} onChange={update} className="w-full border rounded p-2" />
          </div>
          <div>
            <label className="block text-sm mb-1">Email de réception</label>
            <input name="email" type="email" value={form.email} onChange={update} className="w-full border rounded p-2" />
          </div>
          <div>
            <label className="block text-sm mb-1">Téléphone</label>
            <input name="phone" value={form.phone} onChange={update} className="w-full border rounded p-2" />
          </div>
        </div>

        <div>
          <label className="block text-sm mb-1">Adresse</label>
          <input name="address" value={form.address} onChange={update} className="w-full border rounded p-2" />
        </div>
        <div>
          <label className="block text-sm mb-1">Horaires d’ouverture</label>
          <input name="openingHours" value={form.openingHours} onChange={update} className="w-full border rounded p-2" />
        </div>

        <div className="flex gap-3 justify-end">
          <button
            type="submit"
            className="px-5 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-60"
            disabled={status === "saving"}
          >
            {status === "saving" ? "Enregistrement..." : "Enregistrer"}
          </button>
        </div>

        {status === "ok" && <div className="text-green-600">Sauvegardé ✅</div>}
        {status === "error" && <div className="text-red-600">{err}</div>}
      </form>
    </main>
  );
}