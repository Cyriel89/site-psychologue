import Hero from "@/sections/Hero";
import About from "@/sections/About";
import Services from "@/sections/Services";
import SessionSteps from "@/sections/SessionSteps";
import Prices from "@/sections/Prices";
import Partners from "@/sections/Partners";
import Location from "@/sections/Location";

export default function Home() {
  return (
    <main>
      <Hero />
      <About />
      <Services />
      <SessionSteps />
      <Prices />
      <Partners />
      <Location />
    </main>
  );
}
