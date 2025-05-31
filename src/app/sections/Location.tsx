"use client";

import { locationContent } from "@/content/location";
import dynamic from "next/dynamic";
const Map = dynamic(() => import("@/components/Map"), { ssr: false });

export default function Location() {
    return (
        <section className="w-full px-4 py-16 md:py-24 bg-white">
            <div className="max-w-6xl flex">
                {/* Colonne gauche : infos lieu */}
                <div className="w-1/2">
                    <h2 className="text-2xl font-bold text-gray-800">{locationContent.title}</h2>
                    <p className="text-gray-600">
                        {locationContent.subtitle}
                    </p>
                    <p className="text-gray-600">
                        {locationContent.addresses.title} <strong>{locationContent.addresses.address}</strong>
                    </p>
                    <a
                        href= {locationContent.addresses.mapLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block text-blue-600 hover:underline font-medium"
                    >
                        {locationContent.addresses.mapText}
                    </a>
                    <p className="text-gray-600">{locationContent.addresses.openingHoursTitle}</p>
                    {locationContent.addresses.openingHours.map((item, index) => (
                        <p key={index} className="text-gray-600">{item.day} {item.hours}</p>
                    ))}
                    
                </div>

                {/* Colonne droite : carte (à venir) */}
                <div className="w-1/2 h-[400px] bg-gray-200 rounded-xl overflow-hidden">
                    {/* Carte Leaflet interactive à venir ici */}
                    
                        <Map />
                    
                </div>
            </div>

            {/* Lien d'ouverture mobile spécifique */}
            <div className="mt-8 text-center lg:hidden">
                <a
                    href="geo:0,0?q=12 Rue de la Sérénité, 44000 Nantes"
                    className="inline-block bg-blue-600 text-white px-6 py-3 rounded-xl text-lg hover:bg-blue-700 transition"
                >
                    Ouvrir dans une application de navigation
                </a>
            </div>
        </section>
    );
}