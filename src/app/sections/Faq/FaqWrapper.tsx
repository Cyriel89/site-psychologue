import { getFaqs } from "./FaqLoader";
import FaqClient from "./FaqClient";

export const dynamic = "force-dynamic";

export default async function FaqSection() {
  const faqs = await getFaqs();
  return <FaqClient faqs={faqs} />;
}