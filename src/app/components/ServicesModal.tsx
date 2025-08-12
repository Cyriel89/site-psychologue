"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import Image from "next/image";

interface ServiceModalProps {
  title: string;
  content: string;
  imageUrl: string;
  isOpen: boolean;
  onClose: () => void;
}

export default function ServiceModal({ title, content, imageUrl, isOpen, onClose }: ServiceModalProps) {
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/40 px-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="bg-white rounded-xl shadow-2xl w-full max-w-4xl relative flex flex-col md:flex-row overflow-hidden"
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Bouton de fermeture */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 z-10"
            >
              <X />
            </button>

            {/* Image */}
            <div className="relative md:w-1/2 h-64 md:h-auto">
                <Image
                    src={imageUrl}
                    alt={title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 50vw"
                />
            </div>

            {/* Contenu */}
            <div className="md:w-1/2 my-4 p-6 flex flex-col justify-center border-t md:border-t-0 md:border-l border-gray-200">
              <h3 className="text-2xl font-bold mb-4 text-primary">{title}</h3>
              <p className="text-gray-700 leading-relaxed">{content}</p>
              <div className="mt-6 flex justify-end">
                <motion.a
                  href="#contact" // Replace with actual link
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={onClose}
                  className="inline-block px-6 py-3 bg-accent text-white rounded-xl text-lg hover:bg-green-600 transition"
                >
                  Prendre rendez-vous
                </motion.a>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
