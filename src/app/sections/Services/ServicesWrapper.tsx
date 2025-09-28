import { getServices } from "./ServicesLoader";
import ServicesClient from "./ServicesClient";

export const dynamic = "force-dynamic";

export default async function ServicesSection() {
  const services = await getServices();
  return <ServicesClient services={services} />;
}