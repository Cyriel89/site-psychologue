export default function LegalNotice() {
  return (
    <main className="max-w-3xl mx-auto px-4 py-16">
      <h1 className="text-3xl font-bold mb-6">Mentions légales</h1>
      <p className="mb-4">
        Conformément aux dispositions des Articles 6-III et 19 de la Loi n°2004-575 du 21 juin 2004 pour la Confiance dans l&apos;économie numérique, dite L.C.E.N., il est porté à la connaissance des utilisateurs et visiteurs du site les présentes mentions légales.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-2">Éditeur du site</h2>
      <p>
        Nom du professionnel ou de l’entreprise<br />
        Adresse du cabinet<br />
        Téléphone : 06 00 00 00 00<br />
        Email : contact@example.com
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-2">Hébergement</h2>
      <p>
        Nom de l’hébergeur (ex. : OVH, Infomaniak…)<br />
        Adresse de l’hébergeur<br />
        Téléphone : …<br />
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-2">Propriété intellectuelle</h2>
      <p>
        Tous les contenus présents sur le site sont protégés par le droit d’auteur. Toute reproduction est interdite sans autorisation.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-2">Responsabilité</h2>
      <p>
        L’éditeur ne saurait être tenu responsable des dommages directs ou indirects causés au matériel de l’utilisateur lors de l’accès au site.
      </p>
    </main>
  );
}