"use client";

import { servicesContent } from "@/content/services";
import { motion } from "framer-motion";

export default function Services() {
  return (
    <section className="min-h-screen w-full px-4 py-16 bg-secondary text-gray-800 flex flex-col justify-center">
      <div className="max-w-3xl mx-auto text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-primary">
          Domaines d’intervention
        </h2>
        <p className="text-textLight text-base md:text-lg">
          Des prestations adaptées à vos besoins personnels et professionnels.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {servicesContent.services.map((service, index) => {
          const Icon = service.icon;
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2, duration: 0.6 }}
              className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition transform hover:-translate-y-1 group"
            >
              <Icon className="text-primary w-12 h-12 mb-4 group-hover:text-accent transition" />
              <h3 className="text-xl font-semibold mb-2">{service.title}</h3>
              <p className="text-textLight">{service.description}</p>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
