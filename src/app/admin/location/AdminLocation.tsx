"use client";

import { useState } from "react";

type OpeningHours = {
  Lundi: string;
  Mardi: string;
  Mercredi: string;
  Jeudi: string;
  Vendredi: string;
  Samedi: string;
  Dimanche: string;
};

type LocationForm = {
  id: string;
  title: string;
  subtitle: string;
  addressLine1: string;
  addressLine2: string;
  postalCode: string;
  city: string;
  country: string;
  latitude: number;
  longitude: number;
  mapUrl: string;
  notes: string;
  openingHours: OpeningHours;
};

export default function AdminLocation({ initial }: { initial: LocationForm }) {
  const [form, setForm] = useState<LocationForm>(initial);
  const [status, setStatus] = useState<"idle" | "saving" | "ok" | "error">("idle");
  const [err, setErr] = useState("");

  const update = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    if (name in form) {
      setForm((p) => ({ ...p, [name]: name === "latitude" || name === "longitude" ? Number(value) : value }));
    }
  };

  const updateHours = (day: keyof OpeningHours, value: string) => {
    setForm((p) => ({ ...p, openingHours: { ...p.openingHours, [day]: value } }));
  };

  const onSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("saving");
    setErr("");
    
    // Conversion objet → tableau pour la BDD
    const openingHoursArray = Object.entries(form.openingHours).map(([day, hours]) => ({
      day,
      hours
    }));
    
    const payload = { ...form, openingHours: openingHoursArray };
    
    try {
      const res = await fetch("/api/admin/location/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });
      const responseData = await res.json().catch(() => ({}));
      if (!res.ok || !responseData.ok) {
        setStatus("error");
        setErr(responseData.message || "Erreur de sauvegarde.");
        return;
      }
      setStatus("ok");
    } catch {
      setStatus("error");
      setErr("Erreur réseau.");
    }
  };

  return (
    <main className="max-w-4xl mx-auto bg-white rounded-lg border p-6">
      <h1 className="text-xl font-semibold mb-4">Lieu & horaires — Administration</h1>

      <form onSubmit={onSave} className="space-y-6">
        {/* En-tête */}
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm mb-1">Titre</label>
            <input name="title" value={form.title} onChange={update} className="w-full border rounded p-2" />
          </div>
          <div>
            <label className="block text-sm mb-1">Sous-titre</label>
            <input name="subtitle" value={form.subtitle} onChange={update} className="w-full border rounded p-2" />
          </div>
        </div>

        {/* Adresse */}
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm mb-1">Adresse ligne 1</label>
            <input name="addressLine1" value={form.addressLine1} onChange={update} className="w-full border rounded p-2" />
          </div>
          <div>
            <label className="block text-sm mb-1">Adresse ligne 2</label>
            <input name="addressLine2" value={form.addressLine2} onChange={update} className="w-full border rounded p-2" />
          </div>
          <div>
            <label className="block text-sm mb-1">Code postal</label>
            <input name="postalCode" value={form.postalCode} onChange={update} className="w-full border rounded p-2" />
          </div>
          <div>
            <label className="block text-sm mb-1">Ville</label>
            <input name="city" value={form.city} onChange={update} className="w-full border rounded p-2" />
          </div>
          <div>
            <label className="block text-sm mb-1">Pays</label>
            <input name="country" value={form.country} onChange={update} className="w-full border rounded p-2" />
          </div>
        </div>

        {/* Coordonnées / Map */}
        <div className="grid md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm mb-1">Latitude</label>
            <input name="latitude" type="number" step="any" value={form.latitude} onChange={update} className="w-full border rounded p-2" />
          </div>
          <div>
            <label className="block text-sm mb-1">Longitude</label>
            <input name="longitude" type="number" step="any" value={form.longitude} onChange={update} className="w-full border rounded p-2" />
          </div>
          <div>
            <label className="block text-sm mb-1">Lien carte (Google / OSM)</label>
            <input name="mapUrl" value={form.mapUrl} onChange={update} className="w-full border rounded p-2" />
          </div>
        </div>

        {/* Notes */}
        <div>
          <label className="block text-sm mb-1">Notes (optionnel)</label>
          <textarea name="notes" rows={3} value={form.notes} onChange={update} className="w-full border rounded p-2" />
        </div>

        {/* Horaires d'ouverture */}
        <h2 className="font-medium">Horaires d'ouverture</h2>
        <div className="border rounded-lg">
          <div className="grid md:grid-cols-2 gap-4 p-4">
            {(
              [
                "Lundi",
                "Mardi",
                "Mercredi",
                "Jeudi",
                "Vendredi",
                "Samedi",
                "Dimanche",
              ] as Array<keyof OpeningHours>
            ).map((day) => (
              <div key={day}>
                <label className="block text-sm mb-1">{day}</label>
                <input
                  value={form.openingHours[day] ?? ""}
                  onChange={(e) => updateHours(day, e.target.value)}
                  placeholder="ex : 9h - 19h ou Fermé"
                  className="w-full border rounded p-2"
                />
              </div>
            ))}
          </div>
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