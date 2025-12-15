"use client";

import { useState, useTransition, useEffect } from "react";
import { Reorder, useDragControls } from "framer-motion";
import { GripVertical } from "lucide-react";
import { savePartnerAction, deletePartnerAction, reorderPartnersAction, PartnerFormData } from "./actions";
import DynamicIcon from "@/components/DynamicIcon";

type PartnerRow = PartnerFormData & {
  logo?: { id: string; url: string; alt: string | null } | null;
};

type MediaItem = { id: string; url: string; alt: string | null };

export default function PartnersClient({
  initialPartners,
  media,
}: {
  initialPartners: PartnerRow[];
  media: MediaItem[];
}) {
  const [partners, setPartners] = useState<PartnerRow[]>(initialPartners);
  
  useEffect(() => {
    setPartners(initialPartners);
  }, [initialPartners]);

  const [form, setForm] = useState<PartnerRow | null>(null);
  const [isPending, startTransition] = useTransition();
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);

  // --- ACTIONS ---

  const handleCreate = () => {
    setForm({
      id: undefined,
      name: "",
      url: "",
      description: "",
      logoId: "",
      visible: true,
      order: partners.length,
    });
    setFeedback(null);
  };

  const handleSelect = (p: PartnerRow) => {
    setForm(p);
    setFeedback(null);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    if (!form) return;
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    setForm((prev) => (prev ? { ...prev, [name]: type === "checkbox" ? checked : value } : null));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form) return;
    setFeedback(null);

    startTransition(async () => {
      const res = await savePartnerAction(form);
      if (res.success) {
        setFeedback({ type: "success", message: res.message });
      } else {
        setFeedback({ type: "error", message: res.message });
      }
    });
  };

  const handleDelete = () => {
    if (!form?.id || !confirm("Supprimer ce partenaire ?")) return;
    startTransition(async () => {
      const res = await deletePartnerAction(form.id!);
      if (res.success) {
        setForm(null);
        setFeedback({ type: "success", message: res.message });
      } else {
        setFeedback({ type: "error", message: res.message });
      }
    });
  };

  const handleReorder = (newOrder: PartnerRow[]) => {
    const updated = newOrder.map((p, idx) => ({ ...p, order: idx }));
    setPartners(updated);

    const orderedIds = updated.map(p => p.id!).filter(Boolean);
    startTransition(async () => {
      await reorderPartnersAction(orderedIds);
    });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[350px_1fr] gap-8 items-start">
      
      {/* COLONNE GAUCHE : LISTE */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 bg-gray-50 border-b border-gray-100 flex justify-between items-center">
          <h3 className="font-semibold text-gray-700">Partenaires</h3>
          <button onClick={handleCreate} className="text-xs bg-white border border-gray-200 hover:border-indigo-300 text-gray-600 hover:text-indigo-600 px-3 py-1.5 rounded-md shadow-sm transition-all">
            + Ajouter
          </button>
        </div>

        <Reorder.Group axis="y" values={partners} onReorder={handleReorder} className="divide-y divide-gray-50 min-h-[50px]">
          {partners.length === 0 && (
            <div className="p-8 text-center text-sm text-gray-400 italic">Aucun partenaire</div>
          )}
          {partners.map((p) => (
            <DraggableItem 
                key={p.id || "new"} 
                item={p} 
                isSelected={form?.id === p.id} 
                onClick={() => handleSelect(p)} 
            />
          ))}
        </Reorder.Group>
      </div>

      {/* COLONNE DROITE : FORMULAIRE */}
      <div className="lg:sticky lg:top-8">
        {!form ? (
          <div className="bg-white border border-dashed border-gray-300 rounded-xl p-12 text-center text-gray-500">
             <DynamicIcon name="arrow-left" className="w-8 h-8 mx-auto mb-2 text-gray-300" />
             <p>Sélectionnez un partenaire ou créez-en un nouveau.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-6">
            
            <div className="flex justify-between items-start border-b border-gray-100 pb-4">
               <h2 className="text-lg font-bold text-gray-800">
                 {form.id ? "Modifier le partenaire" : "Nouveau partenaire"}
               </h2>
               {form.id && (
                 <button type="button" onClick={handleDelete} className="text-red-600 hover:bg-red-50 p-2 rounded-lg" title="Supprimer">
                   <DynamicIcon name="trash-2" className="w-5 h-5" />
                 </button>
               )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium mb-1">Nom du partenaire *</label>
                    <input name="name" value={form.name} onChange={handleChange} required className="w-full border rounded-lg p-2" placeholder="Ex: Mairie de Nantes" />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">Site Web (URL)</label>
                    <input name="url" value={form.url} onChange={handleChange} className="w-full border rounded-lg p-2" placeholder="https://..." />
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <textarea name="description" value={form.description} onChange={handleChange} rows={3} className="w-full border rounded-lg p-2" placeholder="Optionnel..." />
            </div>

            <div>
                <label className="block text-sm font-medium mb-1">Logo</label>
                <div className="flex gap-4 items-start">
                    <div className="flex-1">
                        <select name="logoId" value={form.logoId || ""} onChange={handleChange} className="w-full border rounded-lg p-2 bg-white">
                            <option value="">— Aucun logo —</option>
                            {media.map(m => <option key={m.id} value={m.id}>{m.alt || m.url}</option>)}
                        </select>
                    </div>
                    <div className="w-20 h-20 bg-gray-50 border rounded-lg flex items-center justify-center overflow-hidden">
                        {form.logoId ? (
                             <img src={media.find(m => m.id === form.logoId)?.url} className="w-full h-full object-contain" alt="" />
                        ) : (
                            <span className="text-xs text-gray-400">Aperçu</span>
                        )}
                    </div>
                </div>
            </div>

            <div className="flex items-center gap-2">
                <input type="checkbox" id="visible" name="visible" checked={form.visible} onChange={handleChange} className="w-4 h-4 text-indigo-600 rounded" />
                <label htmlFor="visible" className="text-sm font-medium text-gray-700">Visible sur le site</label>
            </div>

            {/* Actions */}
            <div className="pt-4 flex items-center justify-between border-t border-gray-100">
                <div className="flex-1">
                    {feedback && (
                        <span className={`text-sm flex items-center gap-2 ${feedback.type === "success" ? "text-green-600" : "text-red-600"}`}>
                            <DynamicIcon name={feedback.type === "success" ? "check" : "alert-circle"} className="w-4 h-4" />
                            {feedback.message}
                        </span>
                    )}
                </div>
                <button 
                    type="submit" 
                    disabled={isPending}
                    className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 font-medium shadow-sm"
                >
                    {isPending ? "Enregistrement..." : "Sauvegarder"}
                </button>
            </div>

          </form>
        )}
      </div>
    </div>
  );
}

// SOUS-COMPOSANT LISTE
function DraggableItem({ item, isSelected, onClick }: { item: PartnerRow, isSelected: boolean, onClick: () => void }) {
    const controls = useDragControls();
    const isDraggable = !!item.id;

    return (
        <Reorder.Item 
            value={item} 
            dragListener={false} 
            dragControls={controls}
            className={`flex items-center gap-3 p-3 hover:bg-gray-50 transition-colors cursor-pointer ${isSelected ? "bg-indigo-50 border-l-4 border-indigo-500 pl-2" : "border-l-4 border-transparent"}`}
            onClick={onClick}
        >
             <div 
                onPointerDown={(e) => isDraggable && controls.start(e)} 
                className={`p-2 rounded hover:bg-black/5 text-gray-400 cursor-grab active:cursor-grabbing ${!isDraggable && "opacity-20 cursor-not-allowed"}`}
                onClick={(e) => e.stopPropagation()}
             >
                <GripVertical className="w-4 h-4" />
             </div>
             
             <div className="flex-1">
                 <div className="font-medium text-gray-800 text-sm">{item.name || "Nouveau..."}</div>
                 <div className="flex items-center gap-2 mt-0.5">
                    {!item.visible && <span className="text-[10px] uppercase font-bold text-red-500 bg-red-50 px-1.5 py-0.5 rounded">Caché</span>}
                    {item.url && <span className="text-xs text-gray-400 truncate max-w-[150px]">{item.url}</span>}
                 </div>
             </div>
             
             <DynamicIcon name="chevron-right" className={`w-4 h-4 text-gray-300 ${isSelected ? "text-indigo-400" : ""}`} />
        </Reorder.Item>
    );
}