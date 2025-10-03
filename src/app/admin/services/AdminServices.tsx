"use client";

import { useMemo, useState } from "react";
import { Reorder, useDragControls } from "framer-motion";
import { GripVertical } from "lucide-react";

type ServiceRow = {
  id: string;
  title: string;
  slug: string;
  iconKey: string | null;
  audience: "INDIVIDUAL" | "COMPANY";
  shortDescription: string;
  longDescription: string;
  priceType: "FIXED" | "QUOTE";
  priceAmount: string | null;
  priceCurrency: string | null;
  imageId: string | null;
  image?: { id: string; url: string; alt: string | null } | null;
  // DB fields utilisés en UI
  visible: boolean;
  order: number;
};

type MediaItem = { id: string; url: string; alt: string | null };

export default function AdminServices({
  initialServices,
  media,
}: {
  initialServices: ServiceRow[];
  media: MediaItem[];
}) {
  const [services, setServices] = useState<ServiceRow[]>(initialServices);
  const [selectedId, setSelectedId] = useState<string | null>(services[0]?.id ?? null);
  const selected = useMemo(
    () => services.find((s) => s.id === selectedId) || null,
    [services, selectedId]
  );
  const [form, setForm] = useState<ServiceRow | null>(selected ?? null);
  const [status, setStatus] = useState<"idle" | "saving" | "error" | "ok">("idle");
  const [err, setErr] = useState("");

  // 🔀 Deux listes séparées
  const individual = useMemo(
    () => services.filter((s) => s.audience === "INDIVIDUAL").sort((a, b) => a.order - b.order),
    [services]
  );
  const company = useMemo(
    () => services.filter((s) => s.audience === "COMPANY").sort((a, b) => a.order - b.order),
    [services]
  );

  const select = (id: string) => {
    const s = services.find((x) => x.id === id) || null;
    setSelectedId(id);
    setForm(s ? { ...s } : null);
    setStatus("idle");
    setErr("");
  };

  // ➕ Nouveau service dans une audience donnée
  const createNew = (audience: "INDIVIDUAL" | "COMPANY") => {
    const next = (audience === "INDIVIDUAL" ? individual : company).length; // ordre à la fin
    const draft: ServiceRow = {
      id: "",
      title: "",
      slug: "",
      iconKey: "",
      audience,
      shortDescription: "",
      longDescription: "",
      priceType: "QUOTE",
      priceAmount: null,
      priceCurrency: null,
      imageId: "",
      image: null,
      visible: true,
      order: next,
    };
    setSelectedId(null);
    setForm(draft);
    setStatus("idle");
    setErr("");
  };

  // 📝 Form update (checkbox OK)
  const update = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    if (!form) return;
    const { name, value, type, checked } = e.target as any;
    const v = type === "checkbox" ? !!checked : value;
    setForm((prev) => (prev ? { ...prev, [name]: v } : prev));
  };

  // 💾 Save (upsert) — gère visible/order tels quels (l’API se charge des cas spéciaux)
  const onSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form) return;
    setStatus("saving");
    setErr("");
    try {
      const res = await fetch("/api/admin/services/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: form.id || undefined,
          title: form.title,
          slug: form.slug,
          iconKey: form.iconKey || null,
          audience: form.audience,
          shortDescription: form.shortDescription,
          longDescription: form.longDescription,
          priceType: form.priceType,
          priceAmount: form.priceType === "FIXED" ? form.priceAmount : null,
          priceCurrency: form.priceType === "FIXED" ? form.priceCurrency || "€" : null,
          imageId: form.imageId || null,
          visible: !!form.visible,
        }),
      });
      const payload = await res.json().catch(() => ({}));
      if (!res.ok || !payload.ok) {
        setErr(typeof payload.message === "string" ? payload.message : "Erreur enregistrement.");
        setStatus("error");
        return;
      }
      const saved: ServiceRow = payload.service;

      // 🔁 Remplace dans la liste et sélectionne
      setServices((prev) => {
        const idx = prev.findIndex((x) => x.id === saved.id);
        if (idx >= 0) {
          const copy = [...prev];
          copy[idx] = saved;
          return copy;
        } else {
          return [...prev, saved];
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

  // 🗑️ Delete
  const onDelete = async () => {
    if (!form || !form.id) return;
    if (!confirm("Supprimer ce service ?")) return;
    try {
      const res = await fetch("/api/admin/services/delete", {
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
      setServices((prev) => prev.filter((x) => x.id !== form.id));
      setSelectedId(null);
      setForm(null);
      setStatus("idle");
    } catch {
      setErr("Erreur réseau.");
      setStatus("error");
    }
  };

  // 🔁 Reorder scindé : une audience à la fois
  async function applyReorderForAudience(
    audience: "INDIVIDUAL" | "COMPANY",
    newSubset: ServiceRow[]
  ) {
    const orderedIds = newSubset.map((s) => s.id);

    // Optimistic update local : maj order uniquement pour cette audience
    setServices((prev) =>
      prev.map((s) => {
        if (s.audience !== audience) return s;
        const idx = orderedIds.indexOf(s.id);
        return idx >= 0 ? { ...s, order: idx } : s;
      })
    );

    // Persistance serveur
    try {
      const res = await fetch("/api/admin/services/reorder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ audience, orderedIds }),
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
    <div className="grid grid-cols-1 lg:grid-cols-[420px_1fr] gap-6">
      {/* Colonnes listes */}
      <aside className="space-y-6">
        {/* Particuliers */}
        <div className="bg-white rounded-lg border">
          <div className="p-3 border-b flex items-center justify-between">
            <h2 className="font-semibold">Particuliers</h2>
            <button
              onClick={() => createNew("INDIVIDUAL")}
              className="text-sm px-3 py-1.5 rounded bg-blue-600 text-white hover:bg-blue-700"
            >
              Nouveau
            </button>
          </div>
          <Reorder.Group
            axis="y"
            values={individual}
            onReorder={(newSubset) => applyReorderForAudience("INDIVIDUAL", newSubset as ServiceRow[])}
            className="max-h-[45vh] overflow-auto divide-y"
          >
            {individual.map((s) => (
              <DraggableListItem
                key={s.id}
                item={s}
                selected={selectedId === s.id}
                onSelect={() => select(s.id)}
              />
            ))}
          </Reorder.Group>
        </div>

        {/* Entreprises */}
        <div className="bg-white rounded-lg border">
          <div className="p-3 border-b flex items-center justify-between">
            <h2 className="font-semibold">Entreprises</h2>
            <button
              onClick={() => createNew("COMPANY")}
              className="text-sm px-3 py-1.5 rounded bg-blue-600 text-white hover:bg-blue-700"
            >
              Nouveau
            </button>
          </div>
          <Reorder.Group
            axis="y"
            values={company}
            onReorder={(newSubset) => applyReorderForAudience("COMPANY", newSubset as ServiceRow[])}
            className="max-h-[45vh] overflow-auto divide-y"
          >
            {company.map((s) => (
              <DraggableListItem
                key={s.id}
                item={s}
                selected={selectedId === s.id}
                onSelect={() => select(s.id)}
              />
            ))}
          </Reorder.Group>
        </div>
      </aside>

      {/* Formulaire */}
      <main className="bg-white rounded-lg border p-4">
        {!form ? (
          <p>Sélectionnez un service ou créez-en un.</p>
        ) : (
          <form onSubmit={onSave} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm mb-1">Titre</label>
                <input name="title" value={form.title} onChange={update} required className="w-full border rounded p-2" />
              </div>
              <div>
                <label className="block text-sm mb-1">Slug</label>
                <input name="slug" value={form.slug} onChange={update} required className="w-full border rounded p-2" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm mb-1">Audience</label>
                <select name="audience" value={form.audience} onChange={update} className="w-full border rounded p-2">
                  <option value="INDIVIDUAL">Particulier</option>
                  <option value="COMPANY">Entreprise</option>
                </select>
              </div>
              <div>
                <label className="block text-sm mb-1">Icon key (lucide)</label>
                <input name="iconKey" value={form.iconKey ?? ""} onChange={update} className="w-full border rounded p-2" placeholder="User, Briefcase, ..." />
              </div>
            </div>

            <div>
              <label className="block text-sm mb-1">Description courte</label>
              <textarea name="shortDescription" value={form.shortDescription} onChange={update} rows={2} className="w-full border rounded p-2" />
            </div>

            <div>
              <label className="block text-sm mb-1">Description longue</label>
              <textarea name="longDescription" value={form.longDescription} onChange={update} rows={6} className="w-full border rounded p-2" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm mb-1">Type de prix</label>
                <select name="priceType" value={form.priceType} onChange={update} className="w-full border rounded p-2">
                  <option value="FIXED">Fixe</option>
                  <option value="QUOTE">Sur devis</option>
                </select>
              </div>

              {form.priceType === "FIXED" && (
                <>
                  <div>
                    <label className="block text-sm mb-1">Montant</label>
                    <input name="priceAmount" value={form.priceAmount ?? ""} onChange={update} className="w-full border rounded p-2" placeholder="60 ou 60.50" />
                  </div>
                  <div>
                    <label className="block text-sm mb-1">Devise</label>
                    <input name="priceCurrency" value={form.priceCurrency ?? "€"} onChange={update} className="w-full border rounded p-2" />
                  </div>
                </>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr] gap-4 items-start">
              <div>
                <label className="block text-sm mb-1">Image (Media)</label>
                <select name="imageId" value={form.imageId ?? ""} onChange={update} className="w-full border rounded p-2">
                  <option value="">— Aucune —</option>
                  {media.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.alt ?? m.url}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                {form.imageId && (
                  <img
                    src={media.find((mi) => mi.id === form.imageId)?.url}
                    alt={media.find((mi) => mi.id === form.imageId)?.alt ?? ""}
                    className="max-h-32 rounded border"
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

function DraggableListItem({
  item,
  selected,
  onSelect,
}: {
  item: ServiceRow;
  selected: boolean;
  onSelect: () => void;
}) {
  const controls = useDragControls();
  const spring = { type: "spring", stiffness: 500, damping: 40, mass: 0.5 };

  return (
    <Reorder.Item
      value={item}
      dragListener={false}
      dragControls={controls}
      transition={{ layout: spring, ...spring }}
      whileDrag={{ scale: 1.02, boxShadow: "0 10px 30px rgba(0,0,0,0.12)" }}
      layout
      className={`p-3 cursor-default select-none bg-white ${
        selected ? "bg-blue-50" : "hover:bg-gray-50"
      }`}
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
            <span className="font-medium">{item.title}</span>
            <div className="flex items-center gap-2">
              <span className="text-xs px-2 py-0.5 rounded bg-gray-100">
                {item.audience === "COMPANY" ? "Entreprise" : "Particulier"}
              </span>
              {!item.visible && (
                <span className="text-xs px-2 py-0.5 rounded bg-red-100 text-red-700">
                  Inactif
                </span>
              )}
            </div>
          </div>
          <div className="text-xs text-gray-500 mt-1">
            ordre: {item.order + 1} · slug: {item.slug}
          </div>
        </div>
      </div>
    </Reorder.Item>
  );
}