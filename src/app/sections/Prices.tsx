"use client";

import { pricesContent } from "@/content/prices";
import { motion } from "framer-motion";

export default function Prices() {
    return (
        <section className="w-full px-4 py-16 bg-gray-100 text-gray-800">
      <div className="max-w-4xl mx-auto text-center">
        <motion.h2
          className="text-3xl md:text-4xl font-bold mb-8"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {pricesContent.title}
        </motion.h2>
      </div>
      <div className="space-y-8">
        {pricesContent.prices.map((prices, index) => (
            <motion.div
            key={index}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.2, duration: 0.6 }}
            className="bg-blue-50 rounded-xl p-6 shadow-md"
            >
            <h3 className="text-xl font-semibold mb-2">{prices.title}</h3>
            <p className="text-gray-700">{prices.price}</p>
            <p className="text-gray-700">{prices.description}</p>
            </motion.div>
        ))}
      </div>
      <div className="mt-8">
        <motion.p
            className="text-3xl md:text-4xl font-bold mb-8"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 0.6 }}
        >
            {pricesContent.subtitle}
        </motion.p>
      </div>
    </section>
    )
}