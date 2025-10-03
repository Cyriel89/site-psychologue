"use client";

import { useMemo, useState } from "react";
import { Reorder, motion, useDragControls } from "framer-motion";
import { GripVertical } from "lucide-react";

type MediaItem = { id: string; url: string; alt: string };
type PartnerRow = {
  id: string;
  name: string;
  url: string;
  description: string;
  logoId: string | null;
  logo: { id: string; url: string; alt: string } | null;
  visible: boolean;
  order: number;
};

export default function AdminPartners({
  initialPartners,
  media,
}: {
  initialPartners: PartnerRow[];
  media: MediaItem[];
}) {
  const [partners, setPartners] = useState<PartnerRow[]>(
    [...initialPartners].sort((a, b) => a.order - b.order)
  );
  const [selectedId, setSelectedId] = useState<string | null>(partners[0]?.id ?? null);
  const selected = useMemo(
    () => partners.find((p) => p.id === selectedId) || null,
    [partners, selectedId]
  );
  const [form, setForm] = useState<PartnerRow | null>(selected ?? null);
  const [status, setStatus] = useState<"idle" | "saving" | "ok" | "error">("idle");
  const [err, setErr] = useState("");

  const select = (id: string) => {
    const p = partners.find((x) => x.id === id) || null;
    setSelectedId(id);
    setForm(p ? { ...p } : null);
    setStatus("idle");
    setErr("");
  };

  const createNew = () => {
    const draft: PartnerRow = {
      id: "",
      name: "",
      url: "",
      description: "",
      logoId: "",
      logo: null,
      visible: true,
      order: partners.length,
    };
    setSelectedId(null);
    setForm(draft);
    setStatus("idle");
    setErr("");
  };

  const update = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    if (!form) return;
    const { name, value, type, checked } = e.target as any;
    setForm((prev) => (prev ? { ...prev, [name]: type === "checkbox" ? !!checked : value } : prev));
  };

  const onSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form) return;
    setStatus("saving");
    setErr("");
    try {
      const res = await fetch("/api/admin/partners/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: form.id || undefined,
          name: form.name,
          url: form.url || null,
          description: form.description || null,
          logoId: form.logoId || null,
          visible: !!form.visible,
          // pas d'envoi d'order: géré côté serveur (création et reorder)
        }),
      });
      const payload = await res.json().catch(() => ({}));
      if (!res.ok || !payload.ok) {
        setErr(typeof payload.message === "string" ? payload.message : "Erreur d'enregistrement.");
        setStatus("error");
        return;
      }
      const saved: PartnerRow = payload.partner;
      setPartners((prev) => {
        const idx = prev.findIndex((x) => x.id === saved.id);
        if (idx >= 0) {
          const copy = [...prev];
          copy[idx] = saved;
          return copy.sort((a, b) => a.order - b.order);
        } else {
          return [...prev, saved].sort((a, b) => a.order - b.order);
        }
      });
      setSelectedId(saved.id);
      setForm(saved);
      setStatus("ok");
    } catch {
      setErr("Erreur réseau.");
      setStatus("error");
    }
  };

  const onDelete = async () => {
    if (!form || !form.id) return;
    if (!confirm("Supprimer ce partenaire ?")) return;
    try {
      const res = await fetch("/api/admin/partners/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: form.id }),
      });
      const payload = await res.json().catch(() => ({}));
      if (!res.ok || !payload.ok) {
        setErr(typeof payload.message === "string" ? payload.message : "Suppression impossible.");
        setStatus("error");
        return;
      }
      setPartners((prev) => prev.filter((x) => x.id !== form.id));
      const first = partners.find((x) => x.id !== form.id) ?? null;
      setSelectedId(first?.id ?? null);
      setForm(first ?? null);
      setStatus("idle");
    } catch {
      setErr("Erreur réseau.");
      setStatus("error");
    }
  };

  // Reorder (simple, pas de sous-groupe)
  const spring = { type: "spring", stiffness: 500, damping: 40, mass: 0.5 };

  async function applyReorder(newList: PartnerRow[]) {
    const orderedIds = newList.map((p) => p.id);
    // optimistic UI
    setPartners(newList.map((p, i) => ({ ...p, order: i })));
    try {
      const res = await fetch("/api/admin/partners/reorder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderedIds }),
      });
      const payload = await res.json().catch(() => ({}));
      if (!res.ok || !payload.ok) {
        setErr(typeof payload.message === "string" ? payload.message : "Erreur de réordonnancement.");
        setStatus("error");
      }
    } catch {
      setErr("Erreur réseau (réordonnancement).");
      setStatus("error");
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[360px_1fr] gap-6">
      {/* Liste */}
      <aside className="bg-white rounded-lg border">
        <div className="flex items-center justify-between p-3 border-b">
          <h2 className="font-semibold">Partenaires</h2>
          <button
            onClick={createNew}
            className="text-sm px-3 py-1.5 rounded bg-blue-600 text-white hover:bg-blue-700"
          >
            Nouveau
          </button>
        </div>

        <Reorder.Group
          axis="y"
          values={partners}
          onReorder={(newList) => applyReorder(newList as PartnerRow[])}
          className="max-h-[70vh] overflow-auto divide-y"
        >
          {partners.map((p) => (
            <ListItem
              key={p.id || Math.random()}
              item={p}
              selected={selectedId === p.id}
              onSelect={() => select(p.id)}
              spring={spring}
            />
          ))}
        </Reorder.Group>
      </aside>

      {/* Form */}
      <main className="bg-white rounded-lg border p-4">
        {!form ? (
          <p>Choisis un partenaire ou crée-en un nouveau.</p>
        ) : (
          <form onSubmit={onSave} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm mb-1">Nom</label>
                <input name="name" value={form.name} onChange={update} required className="w-full border rounded p-2" />
              </div>
              <div>
                <label className="block text-sm mb-1">Site web (optionnel)</label>
                <input name="url" value={form.url ?? ""} onChange={update} className="w-full border rounded p-2" placeholder="https://…" />
              </div>
            </div>

            <div>
              <label className="block text-sm mb-1">Description (optionnelle)</label>
              <textarea name="description" value={form.description ?? ""} onChange={update} rows={3} className="w-full border rounded p-2" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr] gap-4 items-start">
              <div>
                <label className="block text-sm mb-1">Logo (Media)</label>
                <select name="logoId" value={form.logoId ?? ""} onChange={update} className="w-full border rounded p-2">
                  <option value="">— Aucun —</option>
                  {media.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.alt || m.url}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                {form.logoId && (
                  <img
                    src={media.find((mi) => mi.id === form.logoId)?.url}
                    alt={media.find((mi) => mi.id === form.logoId)?.alt || ""}
                    className="max-h-20 rounded border bg-white object-contain p-2"
                  />
                )}
              </div>
            </div>

            <div className="flex items-center gap-4">
              <label className="inline-flex items-center gap-2">
                <input type="checkbox" name="visible" checked={!!form.visible} onChange={update} />
                <span>Visible</span>
              </label>

              <div className="ml-auto flex gap-3">
                {form.id && (
                  <button type="button" onClick={onDelete} className="px-4 py-2 rounded border border-red-300 text-red-700 hover:bg-red-50">
                    Supprimer
                  </button>
                )}
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-60"
                  disabled={status === "saving"}
                >
                  {status === "saving" ? "Enregistrement..." : "Enregistrer"}
                </button>
              </div>
            </div>

            {status === "ok" && <div className="text-green-600">Sauvegardé ✅</div>}
            {status === "error" && <div className="text-red-600">{err}</div>}
          </form>
        )}
      </main>
    </div>
  );
}

function ListItem({
  item,
  selected,
  onSelect,
  spring,
}: {
  item: PartnerRow;
  selected: boolean;
  onSelect: () => void;
  spring: any;
}) {
  const controls = useDragControls();
  return (
    <Reorder.Item
      value={item}
      dragListener={false}
      dragControls={controls}
      transition={{ layout: spring, ...spring }}
      whileDrag={{ scale: 1.02, boxShadow: "0 10px 30px rgba(0,0,0,0.12)" }}
      layout
      className={`p-3 cursor-default select-none bg-white ${selected ? "bg-blue-50" : "hover:bg-gray-50"}`}
    >
      <div className="flex items-center gap-3" onClick={onSelect}>
        <button
          type="button"
          onPointerDown={(e) => controls.start(e)}
          className="p-1 rounded hover:bg-gray-200 active:cursor-grabbing cursor-grab"
          title="Glisser pour réordonner"
          aria-label="Réordonner"
        >
          <GripVertical className="w-4 h-4 text-gray-500" />
        </button>

        <div className="flex-1">
          <div className="flex items-center justify-between">
            <span className="font-medium">{item.name}</span>
            <div className="flex items-center gap-2">
              {!item.visible && (
                <span className="text-xs px-2 py-0.5 rounded bg-red-100 text-red-700">
                  Inactif
                </span>
              )}
            </div>
          </div>
          <div className="text-xs text-gray-500 mt-1">
            ordre: {item.order + 1} · {item.url || "—"}
          </div>
        </div>
      </div>
    </Reorder.Item>
  );
}