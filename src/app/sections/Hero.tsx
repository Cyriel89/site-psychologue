import Image from "next/image";
import { heroContent } from "@/content/hero";

export default function Hero() {
  return (
    <section className="w-full min-h-screen flex flex-col items-center justify-center text-center px-4 py-20 bg-gradient-to-b from-blue-50 to-white relative">
       <div className="w-full lg:w-1/2 flex justify-center">
        <Image
          src= {heroContent.image.src}
          alt= {heroContent.image.alt}
          width={500} // Taille de l'image (ajustée en fonction de ton design)
          height={500} // Ajuste la hauteur en fonction du ratio de l'image
          className="rounded-full shadow-lg"
        />
      </div>
      <div className="max-w-2xl z-10">
        <h2 className="text-lg md:text-xl text-gray-500 mb-2">
          {heroContent.name}
        </h2>
        <h1 className="text-4xl md:text-6xl font-bold mb-4 text-gray-800">
          {heroContent.title}
        </h1>
        <p className="text-lg md:text-xl text-gray-600 mb-8">
          {heroContent.subtitle}
        </p>
        <a
          href={heroContent.cta.href}
          className="px-6 py-3 bg-blue-600 text-white rounded-xl text-lg hover:bg-blue-700 transition"
        >
          {heroContent.cta.label}
        </a>
      </div>
    </section>
  );
}
