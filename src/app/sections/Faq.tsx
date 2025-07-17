"use client";

import { faqContent } from "@/content/faq";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus } from "lucide-react";

export default function Faq() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const toggle = (index: number) => {
    setActiveIndex(index === activeIndex ? null : index);
  };

  return (
    <section id="faq" className="min-h-screen w-full px-4 py-16 bg-secondary flex items-center justify-center">
      <div className="max-w-4xl w-full">
        <motion.h2
          className="text-3xl md:text-4xl font-bold text-primary text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          {faqContent.title}
        </motion.h2>
        <div className="space-y-4">
          {faqContent.faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.4 }}
              className="border border-gray-200 rounded-lg overflow-hidden bg-white shadow-sm"
            >
              <button
                onClick={() => toggle(index)}
                className="w-full flex justify-between items-center p-4 text-left text-gray-800 font-medium hover:bg-gray-50"
              >
                <span>{faq.question}</span>
                <motion.div
                  initial={false}
                  animate={{ rotate: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  {activeIndex === index ? (
                    <Minus className="w-5 h-5" />
                  ) : (
                    <Plus className="w-5 h-5" />
                  )}
                </motion.div>
              </button>
              <AnimatePresence initial={false}>
                {activeIndex === index && (
                  <motion.div
                    key="content"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="px-4 pb-4 text-textLight"
                  >
                    <p>{faq.answer}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
