import type { Metadata } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { SiteFrame } from "@/components/SiteFrame";
import "./globals.css";

const bodyFont = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
});

const titleFont = Cormorant_Garamond({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Landscape Artist Portfolio | Fine Art Nature Photography",
  description:
    "Discover breathtaking landscape photography and fine art prints. Explore a curated collection of nature's most stunning moments, captured with artistic vision and technical excellence.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession(authOptions);
  const isAdmin = session?.user?.isAdmin === true;
  const firstName = session?.user?.name?.split(" ")[0] ?? "Admin";

  return (
    <html
      lang="en"
      className={`${bodyFont.variable} ${titleFont.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <SiteFrame isAdmin={isAdmin} firstName={firstName}>
          {children}
        </SiteFrame>
      </body>
    </html>
  );
}
