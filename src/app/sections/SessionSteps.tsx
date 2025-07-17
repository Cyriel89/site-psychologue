"use client";

import { sessionSteps } from "@/content/sessionSteps";
import { motion } from "framer-motion";

export default function SessionSteps() {
  return (
    <section className="min-h-screen px-4 py-16 bg-white text-gray-800 flex items-center justify-center">
      <div className="max-w-5xl w-full">
        {/* Titre */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
            {sessionSteps.title}
          </h2>
          <p className="text-textLight">{sessionSteps.subtitle}</p>
        </motion.div>

        {/* Timeline */}
        <div className="relative space-y-12">
          {/* Ligne centrale */}
          <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-secondary"></div>

          {sessionSteps.steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2, duration: 0.6 }}
              className={`md:w-1/2 flex flex-col gap-2 ${
                index % 2 === 0
                  ? "md:pr-8 md:items-end md:text-right"
                  : "md:pl-8 md:items-start text-left md:ml-auto"
              }`}
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 flex items-center justify-center rounded-full bg-primary text-white font-semibold z-10">
                  {index + 1}
                </div>
                <h3 className="text-lg font-semibold">{step.title}</h3>
              </div>
              <p className="text-textLight">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
