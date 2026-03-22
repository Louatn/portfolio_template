"use client";

import { usePathname } from "next/navigation";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";

interface SiteFrameProps {
  children: React.ReactNode;
  isAdmin: boolean;
  firstName: string;
}

export function SiteFrame({ children, isAdmin, firstName }: SiteFrameProps) {
  const pathname = usePathname();
  const isDashboardRoute = pathname.startsWith("/dashboard");

  if (isDashboardRoute) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-full bg-[#0a0f0d] text-[#f5f3f0] selection:bg-[#6b8e6f]/30">
      <SiteHeader isAdmin={isAdmin} firstName={firstName} />
      <div>{children}</div>
      <SiteFooter />
    </div>
  );
}