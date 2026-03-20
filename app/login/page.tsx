"use client";

import Link from "next/link";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState("");

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-950 px-6 py-10 text-slate-100">
      {/* Background gradients aligned with Dark Premium Theme */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-emerald-900/20 blur-[120px] mix-blend-screen" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-slate-800/40 blur-[120px] mix-blend-screen" />
        <div className="hero-noise absolute inset-0 opacity-20" />
      </div>

      <div className="relative z-10 w-full max-w-md rounded-3xl border border-slate-800 bg-slate-900/60 p-8 shadow-2xl backdrop-blur-xl">
        <p className="text-xs font-semibold tracking-[0.2em] text-emerald-400">BREIZH PEINTURE RENOV</p>
        <h1 className="mt-3 text-4xl font-bold leading-none text-white">Connexion admin</h1>
        <p className="mt-3 text-sm text-slate-400">
          Accès réservé à l'interface dashboard sécurisée.
        </p>

        <form
          className="mt-8 flex flex-col gap-4"
          onSubmit={async (event) => {
            event.preventDefault();
            setError("");

            const formData = new FormData(event.currentTarget);
            const email = String(formData.get("email") ?? "");
            const password = String(formData.get("password") ?? "");

            const result = await signIn("credentials", {
              email,
              password,
              redirect: false,
              callbackUrl: "/",
            });

            if (!result || result.error) {
              setError("Identifiants invalides");
              return;
            }

            router.push("/");
            router.refresh();
          }}
        >
          <input
            name="email"
            type="email"
            required
            placeholder="admin@example.com"
            className="rounded-xl border border-slate-700 bg-slate-950/50 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-500 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/50 transition-all"
          />
          <input
            name="password"
            type="password"
            required
            placeholder="Mot de passe"
            className="rounded-xl border border-slate-700 bg-slate-950/50 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-500 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/50 transition-all"
          />
          <button
            type="submit"
            className="mt-2 w-full rounded-xl bg-emerald-500 px-4 py-3 text-sm font-semibold text-slate-950 transition-all hover:bg-emerald-400 focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 focus:ring-offset-slate-900"
          >
            Se connecter
          </button>

          {error ? (
            <p className="mt-2 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm font-medium text-red-400">
              {error}
            </p>
          ) : null}
        </form>

        <Link
          href="/"
          className="mt-6 flex justify-center text-sm font-medium text-slate-400 transition-colors hover:text-emerald-400"
        >
          &larr; Retour vers le site
        </Link>
      </div>
    </main>
  );
}
