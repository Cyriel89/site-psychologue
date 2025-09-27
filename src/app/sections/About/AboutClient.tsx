"use client";

import { motion } from "framer-motion";
import { User, Target, HeartHandshake } from "lucide-react";
import { AboutData } from "./AboutLoader";

export default function AboutClient({ about }: { about: AboutData }) {
  return (
    <section
      id="about"
      className="min-h-screen flex items-center justify-center px-4 bg-white"
    >
      <motion.div
        className="max-w-4xl w-full space-y-12"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 1 }}
      >
        <h2 className="text-3xl md:text-4xl font-bold text-primary text-center pt-11 lg:pt-0 mb-12">
          {about.title}
        </h2>

        {/* Présentation */}
        <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
          <User className="text-primary w-16 h-16 flex-shrink-0" />
          <div>
            <h3 className="text-xl font-semibold text-gray-800">Présentation</h3>
            <p className="text-lg text-textLight leading-relaxed">
              {about.description.presentation}
            </p>
          </div>
        </div>

        {/* Mission */}
        <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
          <Target className="text-primary w-16 h-16 flex-shrink-0" />
          <div>
            <h3 className="text-xl font-semibold text-gray-800">Mission</h3>
            <p className="text-lg text-textLight leading-relaxed">
              {about.description.mission}
            </p>
          </div>
        </div>

        {/* Valeurs */}
        <div className="flex flex-col md:flex-row items-start md:items-center gap-4 pb-11 lg:pb-0">
          <HeartHandshake className="text-primary w-16 h-16 flex-shrink-0" />
          <div>
            <h3 className="text-xl font-semibold text-gray-800">Valeurs</h3>
            <p className="text-lg text-textLight leading-relaxed">
              {about.description.goal}
            </p>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
