// components/ContactSection.tsx
"use client";

import {contactContent } from "@/content/contact";
export default function Contact() {
  return (
    <section id="contact" className="py-16 bg-gray-50">
      <div className="container mx-auto px-4 max-w-6xl">
        <h2 className="text-3xl font-bold text-center mb-12">Contact</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Formulaire */}
          <form className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">{ contactContent.form.name.label }</label>
              <input type="text" id="name" name="name" required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">{ contactContent.form.email.label }</label>
              <input type="email" id="email" name="email" required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
            </div>
            <div>
              <label htmlFor="subject" className="block text-sm font-medium text-gray-700">{ contactContent.form.subject.label }</label>
              <input type="text" id="subject" name="subject" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
            </div>
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-700">{ contactContent.form.message.label }</label>
              <textarea id="message" name="message" rows={5} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
            </div>
            <div className="flex items-start space-x-2">
              <input type="checkbox" id="rgpd" name="rgpd" required className="mt-1" />
              <label htmlFor="rgpd" className="text-sm text-gray-700">
                { contactContent.form.rgpd.label }
              </label>
            </div>
            <button type="submit" className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition">
              { contactContent.submitButtonText }
            </button>
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
