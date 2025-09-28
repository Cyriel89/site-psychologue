"use client";

import { footerContent } from "@/content/footer";
import Link from "next/link";
import { Linkedin, Instagram, Facebook } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-primary text-gray-100 py-12">
      <div className="max-w-6xl mx-auto px-4 grid gap-8 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-white/20">
        {/* Coordonnées */}
        <div className="space-y-2 pt-4 md:pt-0 md:px-4">
          <h3 className="text-lg font-semibold text-white">{footerContent.name}</h3>
          <p className="text-sm">{footerContent.address}</p>
          <p className="text-sm">{footerContent.phone}</p>
          <p className="text-sm">
            <a href={`mailto:${footerContent.email}`} className="hover:underline">
              {footerContent.email}
            </a>
          </p>

          {/* Réseaux sociaux */}
          {/*<div className="flex space-x-4 mt-4">
            <a href="#" aria-label="LinkedIn" className="hover:bg-white/10 p-2 rounded-full transition">
              <Linkedin className="w-6 h-6 text-gray-300 hover:text-white" />
            </a>
            <a href="#" aria-label="Instagram" className="hover:bg-white/10 p-2 rounded-full transition">
              <Instagram className="w-6 h-6 text-gray-300 hover:text-white" />
            </a>
            <a href="#" aria-label="Facebook" className="hover:bg-white/10 p-2 rounded-full transition">
              <Facebook className="w-6 h-6 text-gray-300 hover:text-white" />
            </a>
          </div>*/}
        </div>

        {/* Navigation */}
        <div className="space-y-2 pt-4 md:pt-0 md:px-4">
          <h4 className="text-lg font-semibold text-white">Navigation</h4>
          <ul className="space-y-1 text-sm">
            {footerContent.links.map((link, index) => (
              <li key={index}>
                <a href={link.href} className="hover:underline">
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Informations légales */}
        <div className="space-y-2 pt-4 md:pt-0 md:px-4">
          <h4 className="text-lg font-semibold text-white">Informations</h4>
          <ul className="space-y-1 text-sm">
            {footerContent.legal.map((link, index) => (
              <li key={index}>
                <Link href={link.href} className="hover:underline">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-8 text-center text-xs text-gray-300">
        &copy; {footerContent.year} {footerContent.name}. Tous droits réservés.
      </div>
    </footer>
  );
}
