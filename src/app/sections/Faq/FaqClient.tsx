"use client";

import { FaqData } from "./FaqLoader";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus } from "lucide-react";

export default function Faq({ faqs }: { faqs: FaqData[] }) {
  const [openId, setOpenId] = useState<string | null>(null);
  const toggle = (id: string) => setOpenId((prev) => (prev === id ? null : id));


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
          Questions fréquentes
        </motion.h2>
        <div className="space-y-4">
          {faqs.map((faq) => {
            const isOpen = openId === faq.id;
            return (
              <motion.div
                key={faq.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: +faq.id * 0.1, duration: 0.4 }}
                className="border border-gray-200 rounded-lg overflow-hidden bg-white shadow-sm"
              >
                <button
                  onClick={() => toggle(faq.id)}
                  className="w-full flex justify-between items-center p-4 text-left text-gray-800 font-medium hover:bg-gray-50"
                >
                  <span>{faq.question}</span>
                  <motion.div
                    initial={false}
                    animate={{ rotate: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    {openId === faq.id ? (
                      <Minus className="w-5 h-5" />
                    ) : (
                      <Plus className="w-5 h-5" />
                    )}
                  </motion.div>
                </button>
                <AnimatePresence initial={false}>
                  {openId === faq.id && (
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
            );
          })}
        </div>
      </div>
    </section>
  );
}