import { getAbout } from "./AboutLoader";
import AboutClient from "./AboutClient";

export const dynamic = "force-dynamic";

export default async function AboutSection() {
    const about = await getAbout();
    return <AboutClient about={about} />;
}