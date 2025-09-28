"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useMemo, useState } from "react";
import ServicesModal from "@/components/ServicesModal";
import { ServiceData } from "./ServicesLoader";
import DynamicIcon from "@/components/DynamicIcon";

export default function Services({
  services,
}: {
  services: { individual: ServiceData[]; company: ServiceData[] };
}) {
  const [selectedKey, setSelectedKey] = useState<string | null>(null);

  const all = useMemo(
    () => [...services.individual, ...services.company], [services]
  );
  const activeService = useMemo(
    () => all.find((s) => s.slug === selectedKey || s.id === selectedKey) ?? null,
    [all, selectedKey]
  );

  const handleOpen = (key: string) => setSelectedKey(key);
  const handleClose = () => setSelectedKey(null);

  const renderGrid = (items: ServiceData[]) => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
      {items.map((service, index) => {
        return (
          <motion.button
            key={service.id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.15, duration: 0.6 }}
            onClick={() => handleOpen(service.slug || service.id)}
            className="bg-white rounded-xl p-6 text-left shadow-md hover:shadow-lg transition transform hover:-translate-y-1 group"
          >
            <DynamicIcon
              name={service.iconKey}
              className="text-primary w-12 h-12 mb-4 group-hover:text-accent transition"
            />
            <h3 className="text-xl font-semibold mb-2">{service.title}</h3>
            <p className="text-textLight mb-3">{service.shortDescription}</p>
            {/* Prix (label prêt à l'emploi, ex: "60 € / 50 min" ou "Sur devis") */}
            <div className="text-sm font-medium text-gray-700">
              {service.priceLabel}
            </div>
          </motion.button>
        );
      })}
    </div>
  );

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

      {/* Particuliers */}
      {services.individual.length > 0 && (
        <div className="mb-12">
          <h3 className="text-xl font-semibold mb-4">Pour les particuliers</h3>
          {renderGrid(services.individual)}
        </div>
      )}

      {/* Entreprises */}
      {services.company.length > 0 && (
        <div>
          <h3 className="text-xl font-semibold mb-4">Pour les entreprises</h3>
          {renderGrid(services.company)}
        </div>
      )}
      {/* Modal */}
      {activeService && (
        <ServicesModal
          isOpen={!!activeService}
          onClose={handleClose}
          title={activeService.title}
          content={activeService.longDescription}
          imageUrl={activeService.imageUrl || "/images/placeholder.jpg"}
          imageAlt={activeService.imageAlt || activeService.title}
          priceLabel={activeService.priceLabel || undefined}
          cta={
            activeService.priceType === "FIXED"
              ? { label: "Prendre rendez-vous", href: "#booking" } // calendrier plus tard
              : { label: "Demander un devis", href: "#contact" }   // ou mailto:
          }
        />  
      )}
    </section>
  );
}
