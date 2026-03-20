import { compare } from "bcryptjs";
import { randomBytes } from "node:crypto";

import { prisma } from "@/lib/prisma";

const ADMIN_SESSION_TTL_MS = 1000 * 60 * 60 * 24 * 7;

export async function verifyAdminCredentials(email: string, password: string) {
  const normalizedEmail = email.trim().toLowerCase();

  const admin = await prisma.admin.findUnique({
    where: { email: normalizedEmail },
  });

  if (!admin || !admin.isActive) {
    return null;
  }

  const passwordOk = await compare(password, admin.passwordHash);
  if (!passwordOk) {
    return null;
  }

  return admin;
}

export async function createAdminSession(adminId: string) {
  const token = randomBytes(48).toString("hex");
  const expiresAt = new Date(Date.now() + ADMIN_SESSION_TTL_MS);

  const session = await prisma.adminSession.create({
    data: {
      token,
      adminId,
      expiresAt,
    },
  });

  return session;
}

export async function getAdminFromSessionToken(token: string) {
  if (!token) {
    return null;
  }

  const session = await prisma.adminSession.findUnique({
    where: { token },
    include: { admin: true },
  });

  if (!session) {
    return null;
  }

  if (session.expiresAt.getTime() < Date.now() || !session.admin.isActive) {
    await prisma.adminSession.delete({ where: { id: session.id } });
    return null;
  }

  return session.admin;
}

export async function revokeAdminSession(token: string) {
  if (!token) {
    return;
  }

  await prisma.adminSession.deleteMany({
    where: { token },
  });
}

export async function clearExpiredAdminSessions() {
  await prisma.adminSession.deleteMany({
    where: {
      expiresAt: {
        lt: new Date(),
      },
    },
  });
}
