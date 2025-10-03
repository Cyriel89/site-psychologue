"use client";

import { useMemo, useState } from "react";
import { Reorder } from "framer-motion";

type FaqRow = {
  id: string;
  question: string;
  answer: string;
  order: number;
  visible: boolean;
};

export default function AdminFaq({ initialFaqs }: { initialFaqs: FaqRow[] }) {
  const [faqs, setFaqs] = useState<FaqRow[]>(initialFaqs);
  const [selectedId, setSelectedId] = useState<string | null>(faqs[0]?.id ?? null);
  const selected = useMemo(() => faqs.find((f) => f.id === selectedId) ?? null, [faqs, selectedId]);
  const [form, setForm] = useState<FaqRow | null>(selected ?? null);
  const [status, setStatus] = useState<"idle" | "saving" | "ok" | "error">("idle");
  const [err, setErr] = useState("");

  const select = (id: string) => {
    const f = faqs.find((x) => x.id === id) || null;
    setSelectedId(id);
    setForm(f ? { ...f } : null);
    setStatus("idle");
    setErr("");
  };

  const createNew = () => {
    const draft: FaqRow = {
      id: "",
      question: "",
      answer: "",
      order: faqs.length,
      visible: true,
    };
    setSelectedId(null);
    setForm(draft);
    setStatus("idle");
    setErr("");
  };

  const update = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (!form) return;
    const { name, value, type, checked } = e.target as any;
    setForm((p) => (p ? { ...p, [name]: type === "checkbox" ? !!checked : value } : p));
  };

  const onSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form) return;
    setStatus("saving");
    setErr("");
    try {
      const res = await fetch("/api/admin/faq/save", {
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
      const saved: FaqRow = payload.faq;

      setFaqs((prev) => {
        const idx = prev.findIndex((x) => x.id === saved.id);
        if (idx >= 0) {
          const cp = [...prev];
          cp[idx] = saved;
          return cp;
        }
        return [...prev, saved];
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
    if (!confirm("Supprimer cette question ?")) return;
    try {
      const res = await fetch("/api/admin/faq/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: form.id }),
      });
      const payload = await res.json().catch(() => ({}));
      if (!res.ok || !payload.ok) {
        setErr(payload.message || "Suppression impossible.");
        setStatus("error");
        return;
      }
      setFaqs((prev) => prev.filter((x) => x.id !== form.id));
      const first = faqs.find((x) => x.id !== form.id) ?? null;
      setSelectedId(first?.id ?? null);
      setForm(first ?? null);
      setStatus("idle");
    } catch {
      setErr("Erreur réseau.");
      setStatus("error");
    }
  };

  const onReorder = async (newOrder: FaqRow[]) => {
    setFaqs(newOrder.map((f, i) => ({ ...f, order: i })));
    try {
      const res = await fetch("/api/admin/faq/reorder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderedIds: newOrder.map((f) => f.id) }),
      });
      const payload = await res.json().catch(() => ({}));
      if (!res.ok || !payload.ok) {
        setErr(payload.message || "Erreur de réordonnancement.");
        setStatus("error");
      }
    } catch {
      setErr("Erreur réseau.");
      setStatus("error");
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[360px_1fr] gap-6">
      <aside className="bg-white rounded-lg border">
        <div className="flex items-center justify-between p-3 border-b">
          <h2 className="font-semibold">FAQ</h2>
          <button onClick={createNew} className="text-sm px-3 py-1.5 rounded bg-blue-600 text-white hover:bg-blue-700">
            Nouveau
          </button>
        </div>
        <Reorder.Group axis="y" values={faqs} onReorder={onReorder} className="max-h-[70vh] overflow-auto divide-y">
          {faqs.map((f) => (
            <Reorder.Item key={f.id} value={f} className={`p-3 cursor-pointer ${selectedId === f.id ? "bg-blue-50" : "hover:bg-gray-50"}`} onClick={() => select(f.id)}>
              <div className="flex items-center justify-between">
                <span className="font-medium">{f.question}</span>
                {!f.visible && <span className="text-xs px-2 py-0.5 rounded bg-red-100 text-red-700">Inactif</span>}
              </div>
              <div className="text-xs text-gray-500 mt-1">ordre: {f.order + 1}</div>
            </Reorder.Item>
          ))}
        </Reorder.Group>
      </aside>

      <main className="bg-white rounded-lg border p-4">
        {!form ? (
          <p>Sélectionnez une question ou créez-en une nouvelle.</p>
        ) : (
          <form onSubmit={onSave} className="space-y-4">
            <div>
              <label className="block text-sm mb-1">Question</label>
              <input name="question" value={form.question} onChange={update} className="w-full border rounded p-2" />
            </div>
            <div>
              <label className="block text-sm mb-1">Réponse</label>
              <textarea name="answer" value={form.answer} onChange={update} rows={5} className="w-full border rounded p-2" />
            </div>
            <label className="inline-flex items-center gap-2">
              <input type="checkbox" name="visible" checked={!!form.visible} onChange={update} />
              <span>Visible</span>
            </label>

            <div className="flex gap-3 justify-end">
              {form.id && (
                <button type="button" onClick={onDelete} className="px-4 py-2 rounded border border-red-300 text-red-700 hover:bg-red-50">
                  Supprimer
                </button>
              )}
              <button type="submit" className="px-5 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-60" disabled={status === "saving"}>
                {status === "saving" ? "Enregistrement..." : "Enregistrer"}
              </button>
            </div>

            {status === "ok" && <div className="text-green-600">Sauvegardé ✅</div>}
            {status === "error" && <div className="text-red-600">{err}</div>}
          </form>
        )}
      </main>
    </div>
  );
}