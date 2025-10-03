"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { usePathname } from "next/navigation";

const navLinks = [
  { label: "Accueil", href: "#hero" },
  { label: "À propos", href: "#about" },
  { label: "Services", href: "#services" },
  { label: "Partenaires", href: "#partners" },
  { label: "Lieu", href: "#location" },
  { label: "Contact", href: "#contact" },
  { label: "FAQ", href: "#faq" },
];

export default function Header() {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");

  // ✅ TOUS les hooks sont appelés, quelle que soit la route
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isScrolled, setIsScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const updateScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.body.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      setScrollProgress(progress);
      setIsScrolled(scrollTop > 30);
      if (menuOpen) setMenuOpen(false);
    };
    window.addEventListener("scroll", updateScroll);
    return () => window.removeEventListener("scroll", updateScroll);
  }, [menuOpen]);

  useEffect(() => {
    document.documentElement.style.scrollBehavior = "smooth";
  }, []);

  // ✅ On peut retourner null APRÈS avoir appelé les hooks
  if (isAdmin) return null;

  return (
    <header className="fixed top-0 left-0 w-full z-50">
      {/* Scroll bar avec fond opaque pour éviter toute transparence */}
      <div className="bg-white">
        <div
          className="h-1 bg-blue-600 transition-all duration-150"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      {/* Nav */}
      <nav
        className={`bg-white transition-all duration-300 ${
          isScrolled ? "shadow-md py-3" : "py-5"
        }`}
        aria-label="Navigation principale"
      >
        <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
          {/* Logo */}
          <Link
            href="#hero"
            className="text-xl font-bold text-gray-800 hover:text-blue-600 transition"
          >
            Pauline Diné
          </Link>

          {/* Desktop nav */}
          <ul className="hidden md:flex space-x-6">
            {navLinks.map((link, index) => (
              <li key={index}>
                <a
                  href={link.href}
                  className="relative text-gray-700 after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-blue-600 after:transition-all after:duration-300 hover:after:w-full hover:text-blue-600"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>

          {/* Mobile burger */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden text-gray-700"
            aria-label={menuOpen ? "Fermer le menu" : "Ouvrir le menu"}
          >
            {menuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        {/* Mobile dropdown */}
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="md:hidden bg-white px-4 pb-6"
            >
              <ul className="flex flex-col space-y-4 mt-4">
                {navLinks.map((link, index) => (
                  <li key={index}>
                    <a
                      href={link.href}
                      className="text-gray-800 hover:text-blue-600 text-base font-medium"
                      onClick={() => setMenuOpen(false)}
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </header>
  );
}