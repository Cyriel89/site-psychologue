import Link from "next/link";

export default function PlanDuSite() {
  return (
    <main className="max-w-3xl mx-auto px-4 py-16">
      <h1 className="text-3xl font-bold mb-6">Plan du site</h1>

      <ul className="space-y-2 list-disc list-inside">
        <li>
          <Link href="/" className="text-blue-600 hover:underline">Accueil</Link>
        </li>
        <li>
          <a href="#about" className="text-blue-600 hover:underline">À propos</a>
        </li>
        <li>
          <a href="#services" className="text-blue-600 hover:underline">Services</a>
        </li>
        <li>
          <a href="#process" className="text-blue-600 hover:underline">Déroulement d’une séance</a>
        </li>
        <li>
          <a href="#pricing" className="text-blue-600 hover:underline">Tarifs</a>
        </li>
        <li>
          <a href="#partners" className="text-blue-600 hover:underline">Partenaires</a>
        </li>
        <li>
          <a href="#location" className="text-blue-600 hover:underline">Lieu de consultation</a>
        </li>
        <li>
          <a href="#faq" className="text-blue-600 hover:underline">FAQ</a>
        </li>
        <li>
          <a href="#contact" className="text-blue-600 hover:underline">Contact</a>
        </li>
        <li>
          <Link href="/mentions-legales" className="text-blue-600 hover:underline">Mentions légales</Link>
        </li>
        <li>
          <Link href="/politique-confidentialite" className="text-blue-600 hover:underline">Politique de confidentialité</Link>
        </li>
      </ul>
    </main>
  );
}