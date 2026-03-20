import type { NextAuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";

import { verifyAdminCredentials } from "@/lib/admin-auth";

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },
  providers: [
    Credentials({
      name: "Admin credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const email = String(credentials?.email ?? "");
        const password = String(credentials?.password ?? "");

        if (!email || !password) {
          return null;
        }

        const admin = await verifyAdminCredentials(email, password);
        if (!admin) {
          return null;
        }

        return {
          id: admin.id,
          email: admin.email,
          name: "Admin",
          isAdmin: true,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.isAdmin = user.isAdmin;
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = String(token.id ?? "");
        session.user.isAdmin = token.isAdmin === true;
      }

      return session;
    },
  },
};
