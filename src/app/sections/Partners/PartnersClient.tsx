"use client";

import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/autoplay";
import { Autoplay } from "swiper/modules";
import { motion } from "framer-motion";
import { PartnerData } from "./PartnersLoader";

export default function Partners({ partners }: { partners: PartnerData[] }) {
  return (
    <section className="min-h-screen px-4 bg-white items-center flex flex-col justify-center">
      {/* Titre */}
      <motion.h2
        className="text-3xl md:text-4xl font-bold text-primary text-center pt-11 lg:pt-0 mb-12"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        Ils m'ont fait confiance
      </motion.h2>
      <motion.p
        className="text-lg md:text-xl text-textLight mb-10"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.2, duration: 0.6 }}
      >
        Voici quelques-unes des entreprises et institutions qui m'ont fait confiance pour les accompagner dans leur démarche de bien-être au travail.
      </motion.p>

      {/* Carousel */}
      <Swiper
        modules={[Autoplay]}
        autoplay={{ delay: 2500, disableOnInteraction: false }}
        loop={true}
        spaceBetween={30}
        breakpoints={{
          320: { slidesPerView: 2 },
          640: { slidesPerView: 3 },
          1024: { slidesPerView: 5 },
        }}
        className="w-full max-w-6xl mx-auto"
      >
        {partners.map((partner, index) => (
          <SwiperSlide key={index}>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="flex items-center justify-center h-28 w-full bg-gray-50 rounded-lg shadow-sm border border-gray-200 p-2"
            >
              <a href={partner.url ?? undefined} target="_blank" rel="noopener noreferrer">
                <Image
                  src={partner.logoUrl ?? "/images/placeholder-partner.jpg"}
                  alt={partner.logoAlt ?? partner.name}
                  width={200}
                  height={100}
                  sizes="100%"
                  className="max-h-24 object-contain grayscale hover:grayscale-0 hover:scale-105 transition duration-300"
                />
              </a>
            </motion.div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}
