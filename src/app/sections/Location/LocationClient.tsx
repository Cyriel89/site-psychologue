"use client";

import type { LocationData } from "./LocationLoader";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
const Map = dynamic(() => import("@/components/Map"), { ssr: false });

export default function Location({ location }: { location: LocationData }) {
  console.log("Location data:", location);
  return (
    <section id="location" className="min-h-screen w-full px-4 py-16 bg-secondary flex items-center justify-center">
      <div className="max-w-6xl w-full grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Colonne gauche */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="space-y-4"
        >
          <h2 className="text-3xl font-bold text-primary mb-2">
            {location.title}
          </h2>
          <p className="text-textLight">{location.subtitle}</p>
          <p className="text-textLight">
            Adresse du cabinet :
            <strong>{location.address}, {location.cityLine}</strong>
          </p>
          <p className="text-textLight">{location.notes}</p>
          <a
            href={location.mapUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block text-primary font-medium hover:underline"
          >
            Voir sur Google Maps
          </a>
          <div className="mt-4">
            <p className="text-textLight font-semibold">
              Horaires d'ouverture :
            </p>
            {location.openingHours.map((item, index) => (
              <p key={index} className="text-textLight">
                {item.day} {item.hours}
              </p>
            ))}
          </div>
        </motion.div>

        {/* Colonne droite : carte */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="h-[400px] w-full bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden"
        >
          <Map
            professionalPosition={[location.lat, location.lon]}
          />
        </motion.div>
      </div>

      {/* Lien navigation mobile */}
      <motion.div
        className="mt-8 text-center md:hidden"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.4, duration: 0.6 }}
      >
        <a
          href="geo:0,0?q=16 rue de Strasbourg, 44000 Nantes"
          className="inline-block bg-primary text-white px-6 py-3 rounded-full text-lg font-medium hover:bg-primary/90 transition"
        >
          Ouvrir dans une application de navigation
        </a>
      </motion.div>
    </section>
  );
}
