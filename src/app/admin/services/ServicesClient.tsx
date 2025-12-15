"use client";

import { useState, useMemo, useTransition, useEffect } from "react";
import { Reorder, useDragControls } from "framer-motion";
import { GripVertical } from "lucide-react";
import { saveServiceAction, deleteServiceAction, reorderServicesAction, ServiceFormData } from "./actions";
import DynamicIcon from "@/components/DynamicIcon";

// Types
type ServiceRow = ServiceFormData & {
  image?: { id: string; url: string; alt: string | null } | null;
};

type MediaItem = { id: string; url: string; alt: string | null };

export default function ServicesClient({
  initialServices,
  media,
}: {
  initialServices: ServiceRow[];
  media: MediaItem[];
}) {
  const [services, setServices] = useState<ServiceRow[]>(initialServices);
  
  useEffect(() => {
    setServices(initialServices);
  }, [initialServices]);

  const [form, setForm] = useState<ServiceRow | null>(null);
  const [isPending, startTransition] = useTransition();
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);

  // --- FILTRES ---
  const individual = useMemo(
    () => services.filter((s) => s.audience === "INDIVIDUAL").sort((a, b) => a.order - b.order),
    [services]
  );
  const company = useMemo(
    () => services.filter((s) => s.audience === "COMPANY").sort((a, b) => a.order - b.order),
    [services]
  );

  // --- ACTIONS ---

  const handleSelect = (s: ServiceRow) => {
    setForm(s);
    setFeedback(null);
  };

  const handleCreate = (audience: "INDIVIDUAL" | "COMPANY") => {
    const count = audience === "INDIVIDUAL" ? individual.length : company.length;
    
    setForm({
      id: undefined, // undefined = création
      title: "",
      slug: "",
      audience,
      shortDescription: "",
      longDescription: "",
      priceType: "QUOTE",
      priceAmount: "",
      priceCurrency: "€",
      visible: true,
      order: count,
    });
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
      const res = await saveServiceAction(form);
      if (res.success) {
        setFeedback({ type: "success", message: res.message });
      } else {
        setFeedback({ type: "error", message: res.message });
      }
    });
  };

  const handleDelete = () => {
    if (!form?.id || !confirm("Supprimer ce service définitivement ?")) return;
    
    startTransition(async () => {
      const res = await deleteServiceAction(form.id!);
      if (res.success) {
        setForm(null); 
        setFeedback({ type: "success", message: res.message });
      } else {
        setFeedback({ type: "error", message: res.message });
      }
    });
  };

  const handleReorder = (audience: "INDIVIDUAL" | "COMPANY", newOrder: ServiceRow[]) => {
    const otherServices = services.filter(s => s.audience !== audience);
    const updatedAudienceServices = newOrder.map((s, idx) => ({ ...s, order: idx }));
  
    setServices([...otherServices, ...updatedAudienceServices]);

    const orderedIds = updatedAudienceServices.map(s => s.id!);
    startTransition(async () => {
      await reorderServicesAction(orderedIds);
    });
  };

  // --- RENDU ---
  
  return (
    <div className="grid grid-cols-1 lg:grid-cols-[350px_1fr] gap-8 items-start">
      
      {/* COLONNE GAUCHE : LISTES */}
      <div className="space-y-6">
        <ServiceList 
            title="Particuliers" 
            items={individual} 
            onReorder={(items) => handleReorder("INDIVIDUAL", items)}
            onSelect={handleSelect}
            onCreate={() => handleCreate("INDIVIDUAL")}
            selectedId={form?.id}
        />
        
        <ServiceList 
            title="Entreprises" 
            items={company} 
            onReorder={(items) => handleReorder("COMPANY", items)}
            onSelect={handleSelect}
            onCreate={() => handleCreate("COMPANY")}
            selectedId={form?.id}
        />
      </div>

      {/* COLONNE DROITE : FORMULAIRE */}
      <div className="lg:sticky lg:top-8">
        {!form ? (
          <div className="bg-white border border-dashed border-gray-300 rounded-xl p-12 text-center text-gray-500">
            <DynamicIcon name="arrow-left" className="w-8 h-8 mx-auto mb-2 text-gray-300" />
            <p>Sélectionnez un service à gauche ou créez-en un nouveau.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-6">
            
            <div className="flex justify-between items-start border-b border-gray-100 pb-4">
               <div>
                 <h2 className="text-lg font-bold text-gray-800">
                   {form.id ? "Modifier le service" : "Nouveau service"}
                 </h2>
                 <p className="text-sm text-gray-500">{form.audience === "COMPANY" ? "Entreprise" : "Particulier"}</p>
               </div>
               {form.id && (
                 <button type="button" onClick={handleDelete} className="text-red-600 hover:bg-red-50 p-2 rounded-lg transition-colors" title="Supprimer">
                   <DynamicIcon name="trash-2" className="w-5 h-5" />
                 </button>
               )}
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2 md:col-span-1">
                    <label className="block text-sm font-medium mb-1">Titre *</label>
                    <input name="title" value={form.title} onChange={handleChange} required className="w-full border rounded-lg p-2" placeholder="Ex: Consultation" />
                </div>
                <div className="col-span-2 md:col-span-1">
                    <label className="block text-sm font-medium mb-1">Slug (URL) *</label>
                    <input name="slug" value={form.slug} onChange={handleChange} required className="w-full border rounded-lg p-2" placeholder="consultation-adulte" />
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium mb-1">Description courte (Carte)</label>
                <textarea name="shortDescription" value={form.shortDescription} onChange={handleChange} rows={2} className="w-full border rounded-lg p-2" />
            </div>

            <div>
                <label className="block text-sm font-medium mb-1">Description complète</label>
                <textarea name="longDescription" value={form.longDescription} onChange={handleChange} rows={5} className="w-full border rounded-lg p-2" />
            </div>

            <div className="grid grid-cols-3 gap-4 bg-gray-50 p-4 rounded-lg">
                 <div>
                    <label className="block text-sm font-medium mb-1">Prix</label>
                    <select name="priceType" value={form.priceType} onChange={handleChange} className="w-full border rounded-lg p-2 bg-white">
                        <option value="FIXED">Fixe</option>
                        <option value="QUOTE">Sur devis</option>
                    </select>
                 </div>
                 {form.priceType === "FIXED" && (
                    <>
                        <div>
                            <label className="block text-sm font-medium mb-1">Montant</label>
                            <input name="priceAmount" value={form.priceAmount ?? ""} onChange={handleChange} className="w-full border rounded-lg p-2" placeholder="60" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Devise</label>
                            <input name="priceCurrency" value={form.priceCurrency ?? "€"} onChange={handleChange} className="w-full border rounded-lg p-2" />
                        </div>
                    </>
                 )}
            </div>

            <div>
                <label className="block text-sm font-medium mb-1">Image d'illustration</label>
                <div className="flex gap-4">
                    <select name="imageId" value={form.imageId ?? ""} onChange={handleChange} className="w-full border rounded-lg p-2 bg-white">
                        <option value="">— Aucune —</option>
                        {media.map(m => <option key={m.id} value={m.id}>{m.alt || m.url}</option>)}
                    </select>
                    {form.imageId && (
                        <img src={media.find(m => m.id === form.imageId)?.url} className="h-10 w-10 rounded object-cover border" alt="" />
                    )}
                </div>
            </div>

            <div className="flex items-center gap-2">
                <input type="checkbox" id="visible" name="visible" checked={form.visible} onChange={handleChange} className="w-4 h-4 text-indigo-600 rounded" />
                <label htmlFor="visible" className="text-sm font-medium text-gray-700">Afficher ce service sur le site</label>
            </div>

            {/* FEEDBACK & BOUTON */}
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

// --- SOUS-COMPOSANT LISTE DRAGGABLE ---
interface ServiceListProps {
  title: string;
  items: ServiceRow[];
  onReorder: (items: ServiceRow[]) => void;
  onSelect: (item: ServiceRow) => void;
  onCreate: () => void;
  selectedId?: string | null;
}

function ServiceList({ title, items, onReorder, onSelect, onCreate, selectedId }: ServiceListProps) {
    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-4 bg-gray-50 border-b border-gray-100 flex justify-between items-center">
                <h3 className="font-semibold text-gray-700">{title}</h3>
                <button onClick={onCreate} type="button" className="text-xs bg-white border border-gray-200 hover:border-indigo-300 text-gray-600 hover:text-indigo-600 px-3 py-1.5 rounded-md transition-all shadow-sm">
                    + Ajouter
                </button>
            </div>
            
            <Reorder.Group axis="y" values={items} onReorder={onReorder} className="divide-y divide-gray-50 min-h-[50px]">
                {items.length === 0 && (
                    <div className="p-8 text-center text-sm text-gray-400 italic">Aucun service</div>
                )}
                {items.map((item: ServiceRow) => (
                    <DraggableItem key={item.id || "new"} item={item} isSelected={selectedId === item.id} onClick={() => onSelect(item)} />
                ))}
            </Reorder.Group>
        </div>
    )
}

function DraggableItem({ item, isSelected, onClick }: { item: ServiceRow, isSelected: boolean, onClick: () => void }) {
    const controls = useDragControls();
    const isDraggable = !!item.id;

    return (
        <Reorder.Item 
            value={item} 
            dragListener={false} 
            dragControls={controls}
            className={`flex items-center gap-3 p-3 hover:bg-gray-50 transition-colors ${isSelected ? "bg-indigo-50 hover:bg-indigo-50 border-l-4 border-indigo-500 pl-2" : "border-l-4 border-transparent"}`}
        >
             <div 
                onPointerDown={(e) => isDraggable && controls.start(e)} 
                className={`p-2 rounded cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-600 ${!isDraggable && "opacity-20 cursor-not-allowed"}`}
             >
                <GripVertical className="w-4 h-4" />
             </div>
             
             <div className="flex-1 cursor-pointer" onClick={onClick}>
                 <div className="font-medium text-gray-800 text-sm">{item.title || "Nouveau service..."}</div>
                 <div className="flex items-center gap-2 mt-0.5">
                    {!item.visible && <span className="text-[10px] uppercase font-bold text-red-500 bg-red-50 px-1.5 py-0.5 rounded">Caché</span>}
                    <span className="text-xs text-gray-400">{item.priceType === "FIXED" ? `${item.priceAmount} ${item.priceCurrency}` : "Devis"}</span>
                 </div>
             </div>

             <DynamicIcon name="chevron-right" className={`w-4 h-4 text-gray-300 ${isSelected ? "text-indigo-400" : ""}`} />
        </Reorder.Item>
    );
}