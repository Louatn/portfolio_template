import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="relative z-10 border-t border-[#3d4d43]/20 bg-[#0f1512] py-12">
      <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
        <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
          <p className="text-sm text-[#f5f3f0]/40">
            © {new Date().getFullYear()} <Link href="/login">Exemple BTP</Link>. Tous droits reserves.
          </p>
          <div className="flex gap-8 text-sm">
            <a href="#" className="text-[#f5f3f0]/40 transition-colors hover:text-[#6b8e6f]">
              Privacy Policy
            </a>
            <a href="#" className="text-[#f5f3f0]/40 transition-colors hover:text-[#6b8e6f]">
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}