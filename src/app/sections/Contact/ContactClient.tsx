"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ContactData } from "./ContactLoader";

export default function Contact({ contact }: { contact: ContactData }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
    website: "",
    rgpd: false,
  });

  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [formTimeStamp] = useState(() => Date.now());

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" && e.target instanceof HTMLInputElement ? e.target.checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");
    setErrorMsg("");

    if (!formData.name || !formData.email || !formData.subject ||!formData.message || !formData.rgpd) {
      setErrorMsg("Merci de remplir tous les champs obligatoires.");
      setStatus("error");
      return;
    }
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, timestamp: formTimeStamp }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMsg(data.message || "Une erreur s’est produite.");
        setStatus("error");
        return;
      }

      setStatus("success");
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
    <section id="contact" className="min-h-screen w-full px-4 py-16 bg-white flex items-center justify-center">
      <div className="max-w-6xl w-full grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Formulaire */}
        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="space-y-6 bg-gray-50 p-6 rounded-xl shadow-md"
        >
          <h2 className="text-2xl font-bold text-primary mb-4">{contact.title}</h2>
          {contact.intro && <p className="text-gray-600">{contact.intro}</p>}
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
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Nom & Prénom *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              required
              className="mt-1 block w-full rounded-md border border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary transition"
              value={formData.name}
              onChange={handleChange}
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Adresse e-mail *
            </label>
            <input
              type="email"
              id="email"
              name="email"
              required
              className="mt-1 block w-full rounded-md border border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary transition"
              value={formData.email}
              onChange={handleChange}
            />
          </div>
          <div>
            <label htmlFor="subject" className="block text-sm font-medium text-gray-700">
              Sujet *
            </label>
            <input
              type="text"
              id="subject"
              name="subject"
              required
              className="mt-1 block w-full rounded-md border border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary transition"
              value={formData.subject}
              onChange={handleChange}
            />
          </div>
          <div>
            <label htmlFor="message" className="block text-sm font-medium text-gray-700">
              Message *
            </label>
            <textarea
              id="message"
              name="message"
              rows={5}
              required
              className="mt-1 block w-full rounded-md border border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary transition"
              value={formData.message}
              onChange={handleChange}
            />
          </div>
          <div className="flex items-start space-x-2">
            <input
              type="checkbox"
              id="rgpd"
              name="rgpd"
              required
              className="mt-1"
              checked={formData.rgpd}
              onChange={handleChange}
            />
            <label htmlFor="rgpd" className="text-sm text-gray-700">
              {contact.rgpdLabel}
            </label>
          </div>
          <button
            type="submit"
            disabled={status === "sending"}
            className="w-full px-6 py-3 bg-accent text-white rounded-xl text-lg hover:bg-green-600 transition"
          >
            {status === "sending" ? "Envoi en cours..." : "Envoyer"}
          </button>

          {status === "success" && (
            <p className="text-green-600">{contact.successMessage}</p>
          )}
          {status === "error" && (
            <p className="text-red-600">{errorMsg}</p>
          )}
        </motion.form>

        {/* Encadré infos */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="space-y-4"
        >
          {contact.address && (
            <p className="text-gray-700">
              <span className="font-semibold">📍 Adresse :</span> {contact.address}
            </p>
          )}
          {contact.phone && (
            <p className="text-gray-700">
              <span className="font-semibold">📞 Téléphone :</span>{" "}
              <a href={`tel:${contact.phone.replace(/\s/g, "")}`} className="text-blue-600 hover:underline">
                {contact.phone}
              </a>
            </p>
          )}
          {contact.email && (
            <p className="text-gray-700">
              <span className="font-semibold">📧 Email :</span>{" "}
              <a href={`mailto:${contact.email}`} className="text-blue-600 hover:underline">
                {contact.email}
              </a>
            </p>
          )}
          {contact.openingHours && (
            <p className="text-gray-700">
              <span className="font-semibold">🕒 Horaires d'ouverture :</span> {contact.openingHours}
            </p>
          )}
          {/* Liens de prise de RDV si fournis */}
          <a
            href={contact.booking}
            className="inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          >
            Prendre RDV en ligne
          </a>
        </motion.div>
      </div>
    </section>
  );
}
