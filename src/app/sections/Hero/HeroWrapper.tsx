import { getHero } from "./HeroLoader";
import HeroClient from "./HeroClient";

// On force le rendu dynamique pour lire la DB à chaque requête en dev
export const dynamic = "force-dynamic"; // ou: export const revalidate = 0;

export default async function HeroSection() {
  const hero = await getHero();
  return <HeroClient hero={hero} />;
}
