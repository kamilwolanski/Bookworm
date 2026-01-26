process.env.RESEND_API_KEY = "re_test_dummy_key";

import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { PropsWithChildren } from "react";
import { afterEach, vi } from "vitest";

vi.mock("next-auth", () => ({
  default: vi.fn(() => ({
    auth: vi.fn(),
    handlers: { GET: vi.fn(), POST: vi.fn() },
    signIn: vi.fn(),
    signOut: vi.fn(),
  })),
}));

vi.mock("next-auth/react", () => ({
  useSession: () => ({ data: null, status: "unauthenticated" }),
  SessionProvider: ({ children }: PropsWithChildren) => children,
  signIn: vi.fn(),
  signOut: vi.fn(),
}));

vi.mock("resend", () => ({
  Resend: vi.fn().mockImplementation(() => ({
    emails: {
      send: vi.fn().mockResolvedValue({ id: "email_test_id" }),
    },
  })),
}));

afterEach(() => {
  cleanup();
});
