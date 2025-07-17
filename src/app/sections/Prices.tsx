"use client";

import { pricesContent } from "@/content/prices";
import { motion } from "framer-motion";

export default function Prices() {
  return (
    <section className="min-h-screen w-full px-4 py-16 bg-secondary text-gray-800 flex items-center justify-center">
      <div className="max-w-6xl w-full">
        {/* Titre */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
            {pricesContent.title}
          </h2>
        </motion.div>

        {/* Grille tarifs */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {pricesContent.prices.map((price, index) => {
            const Icon = price.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2, duration: 0.6 }}
                className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition transform hover:-translate-y-1 flex flex-col justify-between"
              >
                <div className="flex items-center gap-3 mb-4">
                  <Icon className="text-primary w-10 h-10 flex-shrink-0" />
                  <h3 className="text-lg font-semibold">{price.title}</h3>
                </div>
                <p className="text-textLight mb-4">{price.description}</p>
                <div className="border-t pt-4 mt-4">
                  <p className="text-primary font-bold text-lg">{price.price}</p>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Sous-titre */}
        {pricesContent.subtitle && (
          <motion.p
            className="text-center text-lg text-textLight mt-12"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 1.2, duration: 0.6 }}
          >
            {pricesContent.subtitle}
          </motion.p>
        )}

        {/* Bouton prise de rendez-vous */}
        <motion.div
          className="mt-8 text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 1.4, duration: 0.6 }}
        >
          <motion.a
            href="#contact"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-block px-6 py-3 bg-accent text-white rounded-xl text-lg hover:bg-green-600 transition"
          >
            Prendre rendez-vous
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
}
