import { getLocation } from "./LocationLoader";
import LocationClient from "./LocationClient";

export const dynamic = "force-dynamic";

export default async function LocationSection() {
  const location = await getLocation();
  return <LocationClient location={location} />;
}
