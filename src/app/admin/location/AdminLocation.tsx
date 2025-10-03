"use client";

import { useState } from "react";

type LocationRow = {
  id: string;
  title: string;
  subtitle: string | null;
  addressLine1: string;
  addressLine2: string | null;
  city: string;
  postalCode: string;
  country: string;
  latitude: number;
  longitude: number;
  mapUrl: string | null;
  notes: string | null;
};

export default function AdminLocation({ initial }: { initial: LocationRow }) {
  const [form, setForm] = useState<LocationRow>(initial);
  const [status, setStatus] = useState<"idle" | "saving" | "ok" | "error">("idle");
  const [err, setErr] = useState("");

  const update = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    if (name === "latitude" || name === "longitude") {
      setForm((p) => ({ ...p, [name]: Number(value) }));
    } else {
      setForm((p) => ({ ...p, [name]: value }));
    }
  };

  const onSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("saving");
    setErr("");
    try {
      const res = await fetch("/api/admin/location/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const payload = await res.json().catch(() => ({}));
      if (!res.ok || !payload.ok) {
        setErr(payload.message || "Erreur de sauvegarde.");
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
    <main className="max-w-3xl mx-auto bg-white rounded-lg border p-6">
      <h1 className="text-xl font-semibold mb-4">Lieu — Administration</h1>
      <form onSubmit={onSave} className="space-y-4">
        <div>
          <label className="block text-sm mb-1">Titre</label>
          <input name="title" value={form.title} onChange={update} className="w-full border rounded p-2" />
        </div>
        <div>
          <label className="block text-sm mb-1">Sous-titre</label>
          <input name="subtitle" value={form.subtitle ?? ""} onChange={update} className="w-full border rounded p-2" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm mb-1">Adresse (ligne 1)</label>
            <input name="addressLine1" value={form.addressLine1} onChange={update} className="w-full border rounded p-2" />
          </div>
          <div>
            <label className="block text-sm mb-1">Adresse (ligne 2)</label>
            <input name="addressLine2" value={form.addressLine2 ?? ""} onChange={update} className="w-full border rounded p-2" />
          </div>
          <div>
            <label className="block text-sm mb-1">Ville</label>
            <input name="city" value={form.city} onChange={update} className="w-full border rounded p-2" />
          </div>
          <div>
            <label className="block text-sm mb-1">Code postal</label>
            <input name="postalCode" value={form.postalCode} onChange={update} className="w-full border rounded p-2" />
          </div>
          <div>
            <label className="block text-sm mb-1">Pays</label>
            <input name="country" value={form.country} onChange={update} className="w-full border rounded p-2" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm mb-1">Latitude</label>
            <input name="latitude" type="string" value={form.latitude} onChange={update} className="w-full border rounded p-2" />
          </div>
          <div>
            <label className="block text-sm mb-1">Longitude</label>
            <input name="longitude" type="string" value={form.longitude} onChange={update} className="w-full border rounded p-2" />
          </div>
          <div>
            <label className="block text-sm mb-1">Lien Google Maps</label>
            <input name="mapUrl" value={form.mapUrl ?? ""} onChange={update} className="w-full border rounded p-2" />
          </div>
        </div>

        <div>
          <label className="block text-sm mb-1">Notes</label>
          <textarea name="notes" value={form.notes ?? ""} onChange={update} rows={3} className="w-full border rounded p-2" />
        </div>

        <div className="flex items-center gap-3">
          <button type="submit" className="px-5 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-60" disabled={status === "saving"}>
            {status === "saving" ? "Enregistrement..." : "Enregistrer"}
          </button>
          {status === "ok" && <span className="text-green-600">Sauvegardé ✅</span>}
          {status === "error" && <span className="text-red-600">{err}</span>}
        </div>
      </form>
    </main>
  );
}