import Link from "next/link";
import { SignOutButton } from "@/components/SignOutButton";

interface SiteHeaderProps {
  isAdmin: boolean;
  firstName: string;
}

export function SiteHeader({ isAdmin, firstName }: SiteHeaderProps) {
  return (
    <header className="sticky top-0 z-50 px-6 pt-6 sm:px-8 lg:px-12">
      <div className="mx-auto max-w-7xl">
        <div className="flex items-center justify-between rounded-2xl border border-[#3d4d43]/30 bg-[#0a0f0d]/80 px-6 py-4 shadow-2xl backdrop-blur-xl">
          <Link href="/" className="font-display text-lg tracking-tight text-[#f5f3f0] transition-colors hover:text-[#6b8e6f] sm:text-xl">
            Exemple BTP <span className="ml-2 text-[#6b8e6f]">•</span>
          </Link>

          <div className="flex items-center gap-6">
            <Link href="/#portfolio" className="hidden text-sm text-[#f5f3f0]/70 transition-colors hover:text-[#f5f3f0] sm:block">
              Nos projets
            </Link>
            <Link href="/#about" className="hidden text-sm text-[#f5f3f0]/70 transition-colors hover:text-[#f5f3f0] sm:block">
              A propos
            </Link>
            <Link href="/#contact" className="hidden text-sm text-[#f5f3f0]/70 transition-colors hover:text-[#f5f3f0] sm:block">
              Contact
            </Link>

            {isAdmin ? (
              <div className="flex items-center gap-3">
                <span className="hidden rounded-full border border-emerald-300/30 bg-emerald-300/10 px-3 py-1 text-xs text-emerald-300 md:inline-block">
                  Admin
                </span>
                <Link
                  href="/dashboard"
                  className="rounded-lg border border-[#6b8e6f]/30 bg-[#6b8e6f]/10 px-3 py-1.5 text-xs text-[#6b8e6f] transition-all hover:bg-[#6b8e6f]/20"
                >
                  Panneau de contrôle
                </Link>
                <SignOutButton className="text-xs text-[#f5f3f0]/50 hover:text-[#f5f3f0]" />
              </div>
            ) : (
              <></>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}