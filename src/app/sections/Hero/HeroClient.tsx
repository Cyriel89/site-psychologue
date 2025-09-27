"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { HeroData } from "./HeroLoader";

export default function HeroClient({ hero }: { hero: HeroData }) {
  return (
    <section className="min-h-screen flex flex-col lg:flex-row items-center justify-start lg:justify-center px-4 bg-secondary">
      {/* Image */}
      <motion.div
        className="w-full lg:w-1/2 flex justify-center pt-11 lg:pt-0 mb-8 lg:mb-0"
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1 }}
      >
        <div className="relative w-72 h-72 md:w-96 md:h-96 lg:w-[500px] lg:h-[500px] rounded-xl overflow-hidden shadow-xl">
          <Image
            src={hero.imageUrl}
            alt={hero.imageAlt}
            fill
            className="object-cover"
            priority
          />
        </div>
      </motion.div>

      {/* Texte */}
      <motion.div
        className="w-full lg:w-1/2 text-center lg:text-left max-w-xl"
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.3, duration: 1 }}
      >
        <h2 className="text-lg md:text-xl text-textLight mb-2">{hero.name}</h2>
        <h1 className="text-4xl md:text-6xl font-bold mb-4 text-primary">
          {hero.title}
        </h1>
        <p className="text-lg md:text-xl text-textLight mb-8">
          {hero.subtitle}
        </p>
        <motion.a
          href={hero.cta.href}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="inline-block px-6 py-3 bg-accent text-white rounded-xl text-lg hover:bg-green-600 transition"
        >
          {hero.cta.label}
        </motion.a>
      </motion.div>
    </section>
  );
}
