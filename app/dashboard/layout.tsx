import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth-options";
import { SignOutButton } from "@/components/SignOutButton";
import Link from "next/link";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.isAdmin) {
    redirect("/login");
  }

  const firstName = session.user.name?.split(" ")[0] ?? "Admin";

  return (
    <div className="min-h-screen bg-(--site-ink) text-(--site-cream) flex flex-col font-sans">
      <header className="sticky top-0 z-50 flex items-center justify-between border-b border-white/10 bg-(--site-ink)/80 px-6 py-4 backdrop-blur-md shadow-lg">
        <div className="flex items-center gap-4">
          <Link href="/" className="text-sm font-bold tracking-widest text-(--site-gold) transition hover:text-white">
            Exemple BTP
          </Link>
          <span className="hidden sm:inline-block rounded-full border border-emerald-300/30 bg-emerald-300/10 px-3 py-1 text-xs text-emerald-300">
            Admin
          </span>
        </div>
        <nav className="flex items-center gap-4">
          <Link href="/" className="text-xs font-medium text-(--site-mist) hover:text-white transition">
            Retour au site
          </Link>
          <SignOutButton className="rounded-full border border-red-500/30 px-4 py-1.5 text-xs font-medium text-red-200 transition hover:bg-red-500/10 hover:border-red-500/50" />
        </nav>
      </header>
      <main className="flex-1">
        {children}
      </main>
    </div>
  );
}
