"use client";

import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/autoplay";
import { Autoplay } from "swiper/modules";
import { partnersContent } from "@/content/partners";

export default function Partners() {
    return (
        <section className="w-full px-4 py-16 bg-white text-center">
            <h2 className="text-2xl md:text-4xl font-bold mb-10 text-gray-800">
                {partnersContent.title}
            </h2>
            <p className="text-lg md:text-xl text-gray-600 mb-10">
                {partnersContent.subtitle}
            </p>
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
                className="w-full max-w-5xl mx-auto"
            >
                {partnersContent.partners.map((partner, index) => (
                    <SwiperSlide key={index}>
                        <div className="flex items-center justify-center h-24 w-32">
                            <Image
                                src={partner.logo}
                                alt={partner.alt}
                                width={350}
                                height={300}
                                sizes="100%"
                                className="max-h-32 mx-auto object-contain grayscale hover:grayscale-0 transition"
                            />
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>
        </section>
    )
}
