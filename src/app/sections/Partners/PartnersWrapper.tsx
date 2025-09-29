import { getPartners } from "./PartnersLoader";
import PartnersClient from "./PartnersClient";

export const dynamic = "force-dynamic";

export default async function PartnersSection() {
    const partners = await getPartners();
    return <PartnersClient partners={partners} />;
}