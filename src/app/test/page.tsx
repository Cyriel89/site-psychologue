"use client";
import dynamic from "next/dynamic";

const Map = dynamic(() => import("@/components/Map"), { ssr: false });

export default function TestPage() {
  return (
    <div className="w-full h-screen p-4">
      <h1 className="text-xl font-bold mb-4">Carte de test</h1>
      <div className="w-full h-[500px] border rounded overflow-hidden">
        <Map />
      </div>
    </div>
  );
}
