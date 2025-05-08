"use client";

import { locationContent } from "@/content/location";

export default function Location() {
    return (
        <section className="w-full px-4 py-16 md:py-24 bg-white">
            <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
                {/* Colonne gauche : infos lieu */}
                <div className="space-y-6">
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
                </div>

                {/* Colonne droite : carte (à venir) */}
                <div className="w-full h-80 bg-gray-200 rounded-xl relative overflow-hidden">
                    {/* Carte Leaflet interactive à venir ici */}
                    <div className="absolute inset-0 flex items-center justify-center text-gray-500">
                        Carte en cours d&apos;intégration...
                    </div>
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