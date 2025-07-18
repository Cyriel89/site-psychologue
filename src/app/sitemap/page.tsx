export default function SiteMap() {
  return (
    <main className="max-w-3xl mx-auto px-4 py-16 min-h-screen">
      <h1 className="text-3xl font-bold mb-8">Plan du site</h1>

      <ul className="space-y-4 text-gray-700">
        <li>
          <a href="#hero" className="text-blue-600 hover:underline font-medium">
            Accueil
          </a>
        </li>
        <li>
          <a href="#about" className="text-blue-600 hover:underline font-medium">
            À propos
          </a>
        </li>
        <li>
          <a href="#services" className="text-blue-600 hover:underline font-medium">
            Domaines d’intervention
          </a>
        </li>
        <li>
          <a href="#session" className="text-blue-600 hover:underline font-medium">
            Déroulement d’une séance
          </a>
        </li>
        <li>
          <a href="#prices" className="text-blue-600 hover:underline font-medium">
            Tarifs
          </a>
        </li>
        <li>
          <a href="#partners" className="text-blue-600 hover:underline font-medium">
            Partenaires
          </a>
        </li>
        <li>
          <a href="#location" className="text-blue-600 hover:underline font-medium">
            Lieu de consultation
          </a>
        </li>
        <li>
          <a href="#contact" className="text-blue-600 hover:underline font-medium">
            Contact
          </a>
        </li>
        <li>
          <a href="#faq" className="text-blue-600 hover:underline font-medium">
            FAQ
          </a>
        </li>
      </ul>

      <hr className="my-8 border-gray-300" />

      <ul className="space-y-4 text-gray-700">
        <li>
          <a href="/legal-notice" className="text-blue-600 hover:underline font-medium">
            Mentions légales
          </a>
        </li>
        <li>
          <a href="/privacy-policy" className="text-blue-600 hover:underline font-medium">
            Politique de confidentialité
          </a>
        </li>
        <li>
          <a href="/sitemap" className="text-blue-600 hover:underline font-medium">
            Plan du site
          </a>
        </li>
      </ul>
    </main>
  );
}
