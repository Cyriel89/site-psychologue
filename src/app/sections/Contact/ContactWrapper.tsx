import { getContact } from "./ContactLoader";
import ContactClient from "./ContactClient";

export const dynamic = "force-dynamic";

export default async function ContactSection() {
  const contact = await getContact();
  return <ContactClient contact={contact} />;
};