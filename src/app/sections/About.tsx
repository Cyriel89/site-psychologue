"use client";

import Image from "next/image";
import { aboutContent } from "@/content/about";
import { motion } from "framer-motion";

export default function About() {
  return (
    <section id="about" className="w-full px-4 py-20 bg-white text-gray-800">
      <motion.div 
        className="max-w-3xl mx-auto text-center"
        initial={{ opacity: 0, y: -50 }}
        whileInView={{ opacity:1, y: 0}}
        viewport={{ once: true}}
        transition={{ duration: 1 }}
    >
        <h2 className="text-3xl md:text-4xl font-bold mb-6">{aboutContent.title}</h2>

        <motion.div 
          className="mb-6 flex justify-center"
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <Image
            src={aboutContent.image.src} // À remplacer par la vraie photo
            alt={aboutContent.image.alt}
            width={250}
            height={250}
          />
        </motion.div>

        <motion.p 
          className="text-lg md:text-xl leading-relaxed mb-4"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4, duration: 0.8 }}
        >
            {aboutContent.description.presentation}
        </motion.p>
        <motion.p 
          className="text-lg md:text-xl leading-relaxed mb-4"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6, duration: 0.8 }}
        >
            {aboutContent.description.mission}
        </motion.p>
        <motion.p 
          className="text-lg md:text-xl leading-relaxed"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.8, duration: 0.8 }}
        >
            {aboutContent.description.goal}
        </motion.p>
      </motion.div>
    </section>
  );
}
