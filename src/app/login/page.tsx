"use client";

import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";

export default function LoginPage() {
  const search = useSearchParams();
  const router = useRouter();
  const next = search.get("next") || "/admin";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<"idle"|"loading"|"error">("idle");
  const [error, setError] = useState("");

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setError("");
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json"},
      body: JSON.stringify({ email, password }),
    });
    if (!res.ok) {
      const payload = await res.json().catch(()=>({}));
      setError(payload.message || "Erreur de connexion");
      setStatus("error");
      return;
    }
    router.replace(next);
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-secondary px-4">
      <form onSubmit={onSubmit} className="w-full max-w-sm bg-white rounded-xl p-6 shadow">
        <h1 className="text-xl font-semibold mb-4">Connexion</h1>
        <label className="block text-sm mb-1">Email</label>
        <input
          className="w-full border rounded p-2 mb-3"
          type="email"
          value={email}
          onChange={e=>setEmail(e.target.value)}
          required
        />
        <label className="block text-sm mb-1">Mot de passe</label>
        <input
          className="w-full border rounded p-2 mb-4"
          type="password"
          value={password}
          onChange={e=>setPassword(e.target.value)}
          required
        />
        {status === "error" && <p className="text-sm text-red-600 mb-3">{error}</p>}
        <button
          className="w-full bg-blue-600 text-white rounded py-2 hover:bg-blue-700 transition disabled:opacity-60"
          disabled={status==="loading"}
        >
          {status==="loading" ? "Connexion..." : "Se connecter"}
        </button>
      </form>
    </main>
  );
}
