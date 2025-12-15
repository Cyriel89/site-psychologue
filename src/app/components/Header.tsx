"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import DynamicIcon from "@/components/DynamicIcon";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const closeMenu = () => setIsOpen(false);

  const getHref = (anchor: string) => {
    if (pathname === "/") return `#${anchor}`;
    return `/#${anchor}`;
  };

  const navLinks = [
    { name: "À propos", href: "about" },
    { name: "Services", href: "services" },
    { name: "Lieu", href: "location" },
    { name: "Contact", href: "contact" },
    { name: "FAQ", href: "faq" },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-white/90 backdrop-blur-md shadow-sm py-3" : "bg-transparent py-5"
      }`}
    >
      <div className="container mx-auto px-4 flex items-center justify-between">
        
        {/* LOGO */}
        <Link href="/" className="flex items-center gap-2 font-bold text-xl text-indigo-900">
          <div className="bg-indigo-600 text-white p-1.5 rounded-lg">
            <DynamicIcon name="brain-circuit" className="w-6 h-6" />
          </div>
          <span>Pauline Diné</span>
        </Link>

        {/* NAVIGATION DESKTOP */}
        <nav className="hidden lg:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={getHref(link.href)}
              className="text-sm font-medium text-gray-600 hover:text-indigo-600 transition-colors"
            >
              {link.name}
            </Link>
          ))}
        </nav>

        {/* BOUTONS ACTIONS (Desktop) */}
        <div className="hidden lg:flex items-center gap-3">
          <Link
            href="/login"
            className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-indigo-600 transition-colors"
          >
            Espace Patient
          </Link>
          <Link
            href="/register"
            className="px-4 py-2 text-sm font-medium bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200"
          >
            S'inscrire
          </Link>
        </div>

        {/* BOUTON MENU MOBILE */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="lg:hidden p-2 text-gray-600 hover:text-indigo-600"
        >
          <DynamicIcon name={isOpen ? "x" : "menu"} className="w-6 h-6" />
        </button>
      </div>

      {/* MENU MOBILE (Slide-over) */}
      {isOpen && (
        <div className="lg:hidden absolute top-full left-0 right-0 bg-white border-b border-gray-100 shadow-xl p-4 flex flex-col gap-4">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={getHref(link.href)}
              onClick={closeMenu}
              className="block py-2 text-gray-600 hover:text-indigo-600 font-medium"
            >
              {link.name}
            </Link>
          ))}
          <hr className="border-gray-100 my-2" />
          <Link
            href="/login"
            onClick={closeMenu}
            className="flex items-center justify-center gap-2 w-full py-3 text-gray-700 font-medium bg-gray-50 rounded-lg"
          >
            <DynamicIcon name="user" className="w-4 h-4" />
            Espace Patient
          </Link>
          <Link
            href="/register"
            onClick={closeMenu}
            className="flex items-center justify-center gap-2 w-full py-3 text-white font-medium bg-indigo-600 rounded-lg"
          >
            <DynamicIcon name="user-plus" className="w-4 h-4" />
            S'inscrire
          </Link>
        </div>
      )}
    </header>
  );
}