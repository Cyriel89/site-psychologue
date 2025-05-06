import Link from "next/link";

export default function NotFound() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center text-center px-4">
            <h1 className="text-5xl font-bold mb-4 text-red-600">404</h1>
            <p className="text-xl text-gray-700 mb-8">Page non trouvée.</p>
            <Link href="/" className="text-blue-600 underline hover:text-blue-800 transition">
                Retour à l&apos;accueil
            </Link>
        </div>
    );
}