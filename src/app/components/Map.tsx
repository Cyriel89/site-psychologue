"use client";

import { useEffect, useMemo, useState } from "react";
import { MapContainer, TileLayer, Marker, Polyline, Tooltip, useMap } from "react-leaflet";
import { LatLngExpression } from "leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import type { LocationData } from "@/sections/Location/LocationLoader";

type MapProps = {
    professionalPosition?: [number, number];
};
// Fonction utilitaire pour calculer la distance
function getDistanceInKm(from: LatLngExpression, to: LatLngExpression): number {
    const [lat1, lon1] = from as [number, number];
    const [lat2, lon2] = to as [number, number];
    const R = 6371; // Rayon de la Terre en km
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
        Math.sin(dLat / 2) ** 2 +
        Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return Math.round(R * c * 10) / 10; // arrondi à 0.1 km
}

function ForceResize() {
    const map = useMap();
    useEffect(() => {
        setTimeout(() => {
            map.invalidateSize();
        }, 100); // petit délai pour s'assurer que tout est monté
    }, [map]);
    return null;
}

export default function Map({professionalPosition}: MapProps) {
    const [clientPosition, setClientPosition] = useState<LatLngExpression | null>(null);

    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (pos) => {
                    const { latitude, longitude } = pos.coords;
                    setClientPosition([latitude, longitude]);
                },
                (err) => {
                    console.error("Erreur de géolocalisation :", err);
                }
            );
        }
    }, []);

    const distance = useMemo(() => {
        if (!clientPosition || !professionalPosition) return null;
        return getDistanceInKm(clientPosition, professionalPosition);
    }, [clientPosition, professionalPosition]);

    const centerPosition = useMemo(() => {
        if (!clientPosition) return professionalPosition;
        const [lat1, lon1] = clientPosition as [number, number];
        const [lat2, lon2] = professionalPosition as [number, number];
        return [(lat1 + lat2) / 2, (lon1 + lon2) / 2] as LatLngExpression;
    }, [clientPosition]);

    useEffect(() => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        delete (L.Icon.Default.prototype as any)._getIconUrl;
        L.Icon.Default.mergeOptions({
            iconRetinaUrl: "/leaflet/images/marker-icon-2x.png",
            iconUrl: "/leaflet/images/marker-icon.png",
            shadowUrl: "/leaflet/images/marker-shadow.png",
        });
    }, []);

    return (
        <MapContainer
            center={professionalPosition}
            zoom={9}
            scrollWheelZoom={false}
            className="w-full h-full rounded-xl z-0"
        >
            <ForceResize />
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
                url="https://{s}.tile.openstreetmap.fr/osmfr/{z}/{x}/{y}.png"
            />
            {professionalPosition && (
                <Marker position={professionalPosition}>
                    <Tooltip direction="top" offset={[-15, -10]} permanent>
                        Cabinet
                    </Tooltip>
                </Marker>
            )}
            {clientPosition && (
                <>
                    <Marker position={clientPosition}>
                        <Tooltip direction="top" offset={[-15, -10]} permanent>
                            Vous
                        </Tooltip>
                    </Marker>
                    {professionalPosition && (
                        <Polyline positions={[clientPosition, professionalPosition]} color="blue" />
                    )}
                    {centerPosition && (
                        <Marker position={centerPosition} opacity={0}>
                            <Tooltip permanent direction="bottom" offset={[0, 20]}>
                                <div>
                                    Vous êtes à <span style={{ color: 'green' }}>{distance} km</span> <br />
                                    de votre bien-être
                                </div>
                            </Tooltip>
                        </Marker>
                    )}
                </>
            )}
        </MapContainer>
    );
}
