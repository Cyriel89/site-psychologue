"use client";

import Image from "next/image";
import { heroContent } from "@/content/hero";
import { motion } from "framer-motion";

export default function Hero() {
  return (
    <section className="w-full min-h-screen flex flex-col items-center justify-center text-center px-4 py-20 bg-gradient-to-b from-blue-50 to-white relative overflow-hidden">
      {/* Animation image */}
      <motion.div
        className="w-full lg:w-1/2 flex justify-center mb-8"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        <Image
          src={heroContent.image.src}
          alt={heroContent.image.alt}
          width={500}
          height={500}
          className="rounded-full shadow-lg"
        />
      </motion.div>

      {/* Animation texte */}
      <motion.div
        className="max-w-2xl z-10"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 1 }}
      >
        <h2 className="text-lg md:text-xl text-gray-500 mb-2">
          {heroContent.name}
        </h2>
        <h1 className="text-4xl md:text-6xl font-bold mb-4 text-gray-800">
          {heroContent.title}
        </h1>
        <p className="text-lg md:text-xl text-gray-600 mb-8">
          {heroContent.subtitle}
        </p>
        <motion.a
          href={heroContent.cta.href}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="inline-block px-6 py-3 bg-blue-600 text-white rounded-xl text-lg hover:bg-blue-700 transition"
        >
          {heroContent.cta.label}
        </motion.a>
      </motion.div>
    </section>
  );
}
