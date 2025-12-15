"use client";

import { useState, useTransition } from "react";
import { savePageDraftAction, publishPageAction, unpublishPageAction, restoreRevisionAction } from "./actions";
import DynamicIcon from "@/components/DynamicIcon";

type PageDTO = {
  id: string;
  slug: string;
  title: string;
  content: string;
  status: string; // "DRAFT" | "PUBLISHED"
  publishedAt: Date | null;
  updatedAt: Date;
};

type RevisionDTO = {
  id: string;
  createdAt: Date;
  status: string;
};

export default function LegalPageForm({ 
  initialPage, 
  revisions 
}: { 
  initialPage: PageDTO; 
  revisions: RevisionDTO[] 
}) {
  const [page, setPage] = useState<PageDTO>(initialPage);
  const [isPending, startTransition] = useTransition();
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);

  // --- ACTIONS ---

  const handleSave = () => {
    startTransition(async () => {
      const res = await savePageDraftAction({ id: page.id, title: page.title, content: page.content });
      setFeedback({ type: res.success ? "success" : "error", message: res.message });
    });
  };

  const handlePublish = () => {
    if (!confirm("Confirmer la publication de cette page sur le site ?")) return;
    startTransition(async () => {
      const res = await publishPageAction(page.id);
      if (res.success) setPage(p => ({ ...p, status: "PUBLISHED" }));
      setFeedback({ type: res.success ? "success" : "error", message: res.message });
    });
  };

  const handleUnpublish = () => {
    if (!confirm("Retirer cette page du site (retour en brouillon) ?")) return;
    startTransition(async () => {
      const res = await unpublishPageAction(page.id);
      if (res.success) setPage(p => ({ ...p, status: "DRAFT" }));
      setFeedback({ type: res.success ? "success" : "error", message: res.message });
    });
  };

  const handleRestore = (revId: string) => {
    if (!confirm("Écraser le contenu actuel par cette ancienne version ?")) return;
    startTransition(async () => {
      const res = await restoreRevisionAction(page.id, revId);
      setFeedback({ type: res.success ? "success" : "error", message: res.message });
    });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-6 items-start">
      
      {/* COLONNE GAUCHE : ÉDITEUR */}
      <div className="space-y-6">
        
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
           <div className="mb-4">
              <label className="block text-sm font-medium mb-1 text-gray-700">Titre de la page</label>
              <input 
                value={page.title} 
                onChange={(e) => setPage({ ...page, title: e.target.value })}
                className="w-full border rounded-lg p-2 text-lg font-semibold"
              />
              <p className="text-xs text-gray-400 mt-1">Slug (URL) : /{page.slug} (Non modifiable)</p>
           </div>

           <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">Contenu (Markdown)</label>
              <div className="relative">
                <textarea 
                    value={page.content} 
                    onChange={(e) => setPage({ ...page, content: e.target.value })}
                    className="w-full border rounded-lg p-4 min-h-[500px] font-mono text-sm leading-relaxed focus:ring-2 focus:ring-indigo-500 outline-none"
                    placeholder="# Titre..."
                />
                <div className="absolute top-2 right-2 text-xs text-gray-400 bg-white/80 px-2 rounded">
                    Markdown supporté
                </div>
              </div>
           </div>
        </div>

      </div>

      {/* COLONNE DROITE : ACTIONS & HISTO */}
      <div className="space-y-6 lg:sticky lg:top-8">
        
        {/* Actions Principales */}
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 space-y-3">
            <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-500">Statut</span>
                <span className={`px-2 py-1 text-xs font-bold rounded-full ${
                    page.status === "PUBLISHED" ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"
                }`}>
                    {page.status === "PUBLISHED" ? "PUBLIÉ" : "BROUILLON"}
                </span>
            </div>

            <button 
                onClick={handleSave} 
                disabled={isPending}
                className="w-full py-2 bg-indigo-50 text-indigo-700 font-medium rounded-lg hover:bg-indigo-100 transition-colors flex justify-center gap-2"
            >
                <DynamicIcon name="save" className="w-4 h-4" />
                Sauvegarder
            </button>

            {page.status === "DRAFT" ? (
                <button 
                    onClick={handlePublish} 
                    disabled={isPending}
                    className="w-full py-2 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors flex justify-center gap-2"
                >
                    <DynamicIcon name="globe" className="w-4 h-4" />
                    Publier
                </button>
            ) : (
                <button 
                    onClick={handleUnpublish} 
                    disabled={isPending}
                    className="w-full py-2 bg-white border border-red-200 text-red-600 font-medium rounded-lg hover:bg-red-50 transition-colors flex justify-center gap-2"
                >
                    <DynamicIcon name="eye-off" className="w-4 h-4" />
                    Dépublier
                </button>
            )}

            {feedback && (
                <div className={`text-xs p-2 rounded text-center ${feedback.type === "success" ? "text-green-600 bg-green-50" : "text-red-600 bg-red-50"}`}>
                    {feedback.message}
                </div>
            )}
        </div>

        {/* Historique */}
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
            <h3 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
                <DynamicIcon name="history" className="w-4 h-4" />
                Historique
            </h3>
            
            <div className="max-h-[300px] overflow-y-auto space-y-2 pr-1 custom-scrollbar">
                {revisions.length === 0 && <p className="text-xs text-gray-400 italic">Aucune révision.</p>}
                {revisions.map((rev) => (
                    <div key={rev.id} className="flex items-center justify-between p-2 bg-gray-50 rounded border border-gray-100 text-xs">
                        <div>
                            <div className="font-medium">{new Date(rev.createdAt).toLocaleDateString()}</div>
                            <div className="text-gray-400">{new Date(rev.createdAt).toLocaleTimeString()}</div>
                        </div>
                        <button 
                            onClick={() => handleRestore(rev.id)}
                            disabled={isPending}
                            className="text-indigo-600 hover:underline hover:text-indigo-800"
                        >
                            Restaurer
                        </button>
                    </div>
                ))}
            </div>
        </div>

      </div>

    </div>
  );
}