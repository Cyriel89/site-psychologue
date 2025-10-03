"use client";

import { useState } from "react";
import Image from "next/image";

type MediaRow = {
  id: string;
  url: string;
  alt: string;
  createdAt: string;
};

export default function AdminMedia({ initialMedia }: { initialMedia: MediaRow[] }) {
  const [items, setItems] = useState<MediaRow[]>(initialMedia);
  const [status, setStatus] = useState<"idle" | "uploading" | "error">("idle");
  const [err, setErr] = useState("");

  async function onUpload(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    const file = (fd.get("file") as File | null);
    if (!file) return;
    setStatus("uploading");
    setErr("");
    try {
      const res = await fetch("/api/admin/media/upload", { method: "POST", body: fd });
      const json = await res.json().catch(() => ({}));
      if (!res.ok || !json.ok) {
        setErr(json.message || "Erreur upload");
        setStatus("error");
        return;
      }
      setItems(prev => [json.media, ...prev]);
      form.reset();
      setStatus("idle");
    } catch {
      setErr("Erreur réseau");
      setStatus("error");
    }
  }

  async function onDelete(id: string) {
    if (!confirm("Supprimer ce média ?")) return;
    try {
      const res = await fetch("/api/admin/media/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok || !json.ok) {
        alert(json.message || "Suppression impossible");
        return;
      }
      setItems(prev => prev.filter(x => x.id !== id));
    } catch {
      alert("Erreur réseau");
    }
  }

  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Médias</h1>
      </header>

      <form onSubmit={onUpload} className="bg-white border rounded p-4 flex flex-wrap gap-3 items-end">
        <div>
          <label className="block text-sm mb-1">Fichier</label>
          <input type="file" name="file" accept="image/*" required className="block" />
        </div>
        <div>
          <label className="block text-sm mb-1">Texte alternatif (alt)</label>
          <input type="text" name="alt" placeholder="Description de l’image" className="border rounded p-2" />
        </div>
        <button
          type="submit"
          className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-60"
          disabled={status === "uploading"}
        >
          {status === "uploading" ? "Envoi…" : "Uploader"}
        </button>
        {status === "error" && <span className="text-red-600">{err}</span>}
      </form>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {items.map((m) => (
          <figure key={m.id} className="bg-white border rounded p-2 flex flex-col">
            <div className="relative w-full aspect-square mb-2">
              <Image
                src={m.url}
                alt={m.alt || ""}
                fill
                className="object-contain"
                sizes="200px"
              />
            </div>
            <figcaption className="text-xs text-gray-600 line-clamp-2">{m.alt || m.url}</figcaption>
            <button
              onClick={() => onDelete(m.id)}
              className="mt-2 text-xs px-2 py-1 rounded border border-red-300 text-red-700 hover:bg-red-50"
            >
              Supprimer
            </button>
          </figure>
        ))}
      </div>
    </div>
  );
}