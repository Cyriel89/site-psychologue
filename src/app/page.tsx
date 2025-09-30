import Hero from "@/sections/Hero/HeroWrapper";
import About from "@/sections/About/AboutWrapper";
import Services from "@/sections/Services/ServicesWrapper";
import Partners from "@/sections/Partners/PartnersWrapper";
import Location from "@/sections/Location/LocationWrapper";
import Contact from "@/sections/Contact";
import Faq from "@/sections/Faq";

export default function Home() {
  return (
    <main>
      <Hero />
      <About />
      <Services />
      <Partners />
      <Location />
      <Contact />
      <Faq />
    </main>
  );
}
