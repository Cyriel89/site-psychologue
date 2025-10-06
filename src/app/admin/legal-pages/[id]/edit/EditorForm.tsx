"use client";
import { useState, useTransition } from "react";

type PageDTO = {
  id: string;
  slug: string;
  title: string;
  content: string;
  status: "DRAFT" | "PUBLISHED";
  publishedAt: Date | null;
};

type RevisionDTO = {
  id: string;
  createdAt: Date;
  title: string;
  content: string;
  status: "DRAFT" | "PUBLISHED";
};

export default function EditorForm({ initialPage, revisions }: { initialPage: PageDTO; revisions: RevisionDTO[] }) {
  const [page, setPage] = useState<PageDTO>(initialPage);
  const [pending, startTransition] = useTransition();
  const [msg, setMsg] = useState<string | null>(null);

  async function saveDraft() {
    setMsg(null);
    startTransition(async () => {
      const res = await fetch(`/api/admin/pages/${page.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: page.title, content: page.content, status: "DRAFT" }),
      });
      const j = await res.json();
      setMsg(j.ok ? "Brouillon enregistré." : j.error || "Erreur");
    });
  }

  async function publish() {
    setMsg(null);
    startTransition(async () => {
      const res = await fetch(`/api/admin/pages/${page.id}/publish`, { method: "POST" });
      const j = await res.json();
      setMsg(j.ok ? "Publié !" : j.error || "Erreur");
    });
  }

  async function unpublish() {
    setMsg(null);
    startTransition(async () => {
      const res = await fetch(`/api/admin/pages/${page.id}/unpublish`, { method: "POST" });
      const j = await res.json();
      setMsg(j.ok ? "Dépublié." : j.error || "Erreur");
    });
  }

  async function restore(revId: string) {
    setMsg(null);
    startTransition(async () => {
      const res = await fetch(`/api/admin/pages/${page.id}/revisions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ revisionId: revId }),
      });
      const j = await res.json();
      setMsg(j.ok ? "Révision restaurée." : j.error || "Erreur");
      if (j.data) setPage((p) => ({ ...p, title: j.data.title, content: j.data.content, status: j.data.status }));
    });
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Éditer : {page.slug}</h1>

      <div className="grid gap-3">
        <input
          className="input"
          value={page.title}
          onChange={(e) => setPage({ ...page, title: e.target.value })}
          placeholder="Titre"
        />
        <textarea
          className="textarea min-h-[300px]"
          value={page.content}
          onChange={(e) => setPage({ ...page, content: e.target.value })}
          placeholder="Contenu (Markdown)"
        />
      </div>

      <div className="flex gap-2">
        <button className="btn btn-secondary" disabled={pending} onClick={saveDraft}>Enregistrer (brouillon)</button>
        <button className="btn btn-primary" disabled={pending} onClick={publish}>Publier</button>
        <button className="btn" disabled={pending} onClick={unpublish}>Dépublier</button>
      </div>

      {msg && <p className="text-sm text-gray-600">{msg}</p>}

      <div className="mt-10">
        <h2 className="text-lg font-medium mb-3">Historique (20 dernières)</h2>
        <div className="border rounded divide-y">
          {revisions.length === 0 && <div className="p-4 text-sm text-gray-500">Aucune révision.</div>}
          {revisions.map((r) => (
            <div key={r.id} className="p-4 flex items-center justify-between">
              <div>
                <div className="font-medium">{new Date(r.createdAt).toLocaleString()}</div>
                <div className="text-sm text-gray-500">Statut: {r.status}</div>
              </div>
              <button className="btn" onClick={() => restore(r.id)}>Restaurer</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}