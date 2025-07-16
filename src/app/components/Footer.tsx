"use client";

import { footerContent } from "@/content/footer";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-gray-800 text-gray-200 py-12 mt-16">
      <div className="container mx-auto px-4 max-w-6xl grid gap-8 md:grid-cols-3">
        {/* Coordonnées */}
        <div>
          <h3 className="text-lg font-semibold mb-2">{footerContent.name}</h3>
          <p className="text-sm">{footerContent.address}</p>
          <p className="text-sm mt-1">{footerContent.phone}</p>
          <p className="text-sm mt-1">
            <a href={`mailto:${footerContent.email}`} className="hover:underline">
              {footerContent.email}
            </a>
          </p>
        </div>

        {/* Navigation */}
        <div>
          <h4 className="text-lg font-semibold mb-2">Navigation</h4>
          <ul className="space-y-1">
            {footerContent.links.map((link, index) => (
              <li key={index}>
                <a href={link.href} className="hover:underline">
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Légal */}
        <div>
          <h4 className="text-lg font-semibold mb-2">Informations</h4>
          <ul className="space-y-1">
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

      {/* Bas de page */}
      <div className="mt-8 text-center text-sm text-gray-500">
        &copy; {footerContent.year} {footerContent.name}. Tous droits réservés.
      </div>
    </footer>
  );
}
