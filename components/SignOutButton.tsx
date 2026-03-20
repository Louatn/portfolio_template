"use client";

import { signOut } from "next-auth/react";

export function SignOutButton({ className }: { className?: string }) {
  return (
    <button
      onClick={() => signOut({ callbackUrl: "/" })}
      className={
        className ||
        "rounded-full border border-white/30 px-3 py-1 text-xs font-medium transition hover:bg-white/12 text-(--site-cream)"
      }
    >
      Se deconnecter
    </button>
  );
}
