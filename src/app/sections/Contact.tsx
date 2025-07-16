// components/ContactSection.tsx
"use client";

import { useState } from "react";
import {contactContent } from "@/content/contact";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
    website: "", // Honeypot field
    rgpd: false,
  });

  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [formTimeStamp] = useState(() => Date.now());

  // Fonction appelée à chaque modification d’un champ du formulaire
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;

    // Mise à jour de la donnée correspondante dans formData
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" && e.target instanceof HTMLInputElement ? e.target.checked : value,
    }));
  };

  // Fonction appelée lors de la soumission du formulaire
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Empêche le rechargement de la page

    setStatus("sending"); // On affiche "envoi en cours..."
    setErrorMsg(""); // Réinitialise le message d'erreur

    if (!formData.name || !formData.email || !formData.message || !formData.rgpd) {
      setErrorMsg("Merci de remplir tous les champs obligatoires.");
      setStatus("error");
      return;
    }
    try {
      // Envoi des données au back-end via l'API
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, timeStamp: formTimeStamp }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMsg(data.message || "Une erreur s’est produite.");
        setStatus("error");
        return;
      }
      // Envoi réussi → on passe l’état à "success"
      setStatus("success");

      // On vide les champs
      setFormData({
        name: "",
        email: "",
        subject: "",
        message: "",
        website: "",
        rgpd: false,
      });
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      console.error("Une erreur réseau s'est produite.");
      setStatus("error");
    }
  };

  return (
    <section id="contact" className="py-16 bg-gray-50">
      <div className="container mx-auto px-4 max-w-6xl">
        <h2 className="text-3xl font-bold text-center mb-12">Contact</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Formulaire */}
          <form className="space-y-6">
            <input
              type="text"
              name="website"
              autoComplete="off"
              className="hidden"
              tabIndex={-1}
              value={formData.website}
              onChange={handleChange}
            />
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">{ contactContent.form.name.label }</label>
              <input type="text" id="name" name="name" required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" value={formData.name} onChange={handleChange}/>
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">{ contactContent.form.email.label }</label>
              <input type="email" id="email" name="email" required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" value={formData.email} onChange={handleChange}/>
            </div>
            <div>
              <label htmlFor="subject" className="block text-sm font-medium text-gray-700">{ contactContent.form.subject.label }</label>
              <input type="text" id="subject" name="subject" required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" value={formData.subject} onChange={handleChange}/>
            </div>
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-700">{ contactContent.form.message.label }</label>
              <textarea id="message" name="message" rows={5} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" value={formData.message} onChange={handleChange}/>
            </div>
            <div className="flex items-start space-x-2">
              <input type="checkbox" id="rgpd" name="rgpd" required className="mt-1" checked={formData.rgpd} onChange={handleChange}/>
              <label htmlFor="rgpd" className="text-sm text-gray-700">
                { contactContent.form.rgpd.label }
              </label>
            </div>
            <button type="submit" className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition" disabled={status === "sending"} onClick={handleSubmit}>
              {status === "sending" ? "Envoi en cours..." : contactContent.submitButtonText}
            </button>

            {/* Message de confirmation ou d'erreur */}
            {status === "success" && (
              <p className="text-green-600">Votre message a été envoyé avec succès.</p>
            )}
            {status === "error" && (
              <p className="text-red-600">{errorMsg}</p>
            )}
          </form>

          {/* Encadré latéral (optionnel) */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">{ contactContent.infoBox.title }</h3>
            {contactContent.infoBox.items.map((item, index) => (
                <p key={index} className="text-gray-600">{ item.icon } { item.text }</p>         
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
