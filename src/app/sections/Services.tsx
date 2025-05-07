"use client";

import { servicesContent } from "@/content/services";
import { motion } from "framer-motion";

export default function Services() {
    return (
      <section className="w-full px-4 py-16 bg-white text-gray-800">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Domaines d’intervention</h2>
          <p className="text-gray-600 text-base">
            Des prestations adaptées à vos besoins personnels et professionnels.
          </p>
        </div>
        <div className="space-y-8">
          {servicesContent.services.map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2, duration: 0.6 }}
              className="bg-blue-50 rounded-xl p-6 shadow-md"
            >
              <h3 className="text-xl font-semibold mb-2">{service.title}</h3>
              <p className="text-gray-700">{service.description}</p>
            </motion.div>
          ))}
        </div>
      </section>
    );
  }