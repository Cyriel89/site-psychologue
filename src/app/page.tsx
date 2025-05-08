import Hero from "@/sections/Hero";
import About from "@/sections/About";
import Services from "@/sections/Services";
import SessionSteps from "@/sections/SessionSteps";
import Prices from "@/sections/Prices";

export default function Home() {
  return (
    <main>
      <Hero />
      <About />
      <Services />
      <SessionSteps />
      <Prices />
    </main>
  );
}
