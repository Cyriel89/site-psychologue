"use client";

import { useState, useTransition, useRef } from "react";
import { uploadMediaAction, deleteMediaAction } from "./actions";
import DynamicIcon from "@/components/DynamicIcon";

type MediaItem = {
  id: string;
  url: string;
  alt: string | null;
  createdAt: Date;
};

export default function MediaClient({ initialMedia }: { initialMedia: MediaItem[] }) {
  const [isPending, startTransition] = useTransition();
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const [preview, setPreview] = useState<string | null>(null);

  // --- UPLOAD ---
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPreview(URL.createObjectURL(file));
    } else {
      setPreview(null);
    }
  };

  const handleUpload = async (formData: FormData) => {
    setFeedback(null);
    
    const res = await uploadMediaAction(formData);

    if (res.success) {
      setFeedback({ type: "success", message: res.message });
      formRef.current?.reset();
      setPreview(null);
    } else {
      setFeedback({ type: "error", message: res.message });
    }
  };

  // --- DELETE ---
  const handleDelete = (id: string) => {
    if (!confirm("Voulez-vous vraiment supprimer cette image ? Elle disparaîtra du site.")) return;
    
    startTransition(async () => {
      const res = await deleteMediaAction(id);
      if (res.success) {
        setFeedback({ type: "success", message: res.message });
      } else {
        setFeedback({ type: "error", message: res.message });
      }
    });
  };

  // --- COPY URL ---
  const handleCopyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    setFeedback({ type: "success", message: "Lien copié dans le presse-papier !" });
    setTimeout(() => setFeedback(null), 2000);
  };

  return (
    <div className="space-y-8">
      
      {/* ZONE D'UPLOAD */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <DynamicIcon name="upload-cloud" className="w-5 h-5 text-indigo-600" />
            Ajouter une nouvelle image
        </h2>
        
        <form 
            ref={formRef} 
            action={handleUpload} 
            className="flex flex-col md:flex-row gap-6 items-start"
        >
            <div className="flex-1 w-full space-y-4">
                <div className="relative border-2 border-dashed border-gray-300 rounded-lg p-6 hover:bg-gray-50 transition-colors text-center cursor-pointer group">
                    <input 
                        type="file" 
                        name="file" 
                        accept="image/*" 
                        required 
                        onChange={handleFileChange}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <div className="space-y-2 pointer-events-none">
                        <DynamicIcon name="image" className="w-8 h-8 mx-auto text-gray-400 group-hover:text-indigo-500" />
                        <p className="text-sm text-gray-500 font-medium">
                            Cliquez ou glissez une image ici
                        </p>
                        <p className="text-xs text-gray-400">JPG, PNG, WEBP (Max 5Mo)</p>
                    </div>
                </div>

                <div className="flex gap-2">
                    <input 
                        name="alt" 
                        placeholder="Texte alternatif (description pour le référencement)" 
                        className="flex-1 border rounded-lg px-4 py-2 text-sm"
                    />
                    <SubmitButton />
                </div>
            </div>

            {/* PREVIEW */}
            <div className="w-32 h-32 bg-gray-100 rounded-lg border border-gray-200 flex items-center justify-center overflow-hidden shrink-0">
                {preview ? (
                    <img src={preview} alt="Aperçu" className="w-full h-full object-cover" />
                ) : (
                    <span className="text-xs text-gray-400">Aperçu</span>
                )}
            </div>
        </form>

        {feedback && (
            <div className={`mt-4 p-3 rounded-lg text-sm flex items-center gap-2 ${feedback.type === "success" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}>
                <DynamicIcon name={feedback.type === "success" ? "check" : "alert-circle"} className="w-4 h-4" />
                {feedback.message}
            </div>
        )}
      </div>

      {/* GALERIE */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {initialMedia.map((file) => (
            <div key={file.id} className="group relative bg-white border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                {/* Image */}
                <div className="aspect-square bg-gray-100 relative">
                    <img src={file.url} alt={file.alt || "Image"} className="w-full h-full object-cover" loading="lazy" />
                    
                    {/* Overlay Actions */}
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                        <button 
                            onClick={() => handleCopyUrl(file.url)} 
                            className="p-2 bg-white text-gray-800 rounded-full hover:scale-110 transition-transform" 
                            title="Copier le lien"
                        >
                            <DynamicIcon name="link" className="w-4 h-4" />
                        </button>
                        <button 
                            onClick={() => handleDelete(file.id)} 
                            disabled={isPending}
                            className="p-2 bg-red-600 text-white rounded-full hover:scale-110 transition-transform" 
                            title="Supprimer"
                        >
                            <DynamicIcon name="trash-2" className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                {/* Info */}
                <div className="p-2 text-xs text-gray-500 truncate border-t bg-gray-50">
                    {file.alt || "Sans nom"}
                </div>
            </div>
        ))}
      </div>
    </div>
  );
}

import { useFormStatus } from "react-dom";
function SubmitButton() {
    const { pending } = useFormStatus();
    return (
        <button 
            type="submit" 
            disabled={pending}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 text-sm font-medium"
        >
            {pending ? "Envoi..." : "Uploader"}
        </button>
    )
}