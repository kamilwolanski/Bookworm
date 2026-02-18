import { test as setup } from "@playwright/test";
import { PrismaClient } from "@prisma/client";
import { encode } from "next-auth/jwt";
import { loadEnvConfig } from '@next/env'

const projectDir = process.cwd()
loadEnvConfig(projectDir)


const prisma = new PrismaClient();

const authFile = "tests/.auth/user.json";

setup("authenticate", async ({ page }) => {
  const email = "e2e@test.com";

  // 1. znajdź lub utwórz usera
  let user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    user = await prisma.user.create({
      data: {
        email,
        name: "E2E User",
        role: "USER",
      },
    });
  }

  // 2. utwórz JWT token NextAuth
  const token = await encode({
    token: {
      id: user.id,
      email: user.email,
      role: user.role,
    },
    secret: process.env.AUTH_SECRET!,
    salt: "next-auth.salt",
  });

  // 3. ustaw cookie
  await page.context().addCookies([
    {
      name: "authjs.session-token",
      value: token,
      domain: "localhost",
      path: "/",
      httpOnly: true,
      sameSite: "Lax",
      secure: false,
    },
  ]);

  // 4. zapisz session
  await page.context().storageState({
    path: authFile,
  });
});
