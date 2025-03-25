//TODO: Move all Firebase mocks to a separate file during next Sprint for better organization.

import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import PricingPage from "../app/pricing/page";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

vi.mock("firebase/auth", () => {
  return {
    getAuth: vi.fn().mockReturnValue({}),
    setPersistence: vi.fn().mockResolvedValue(undefined),
    browserLocalPersistence: {},
    signInWithEmailAndPassword: vi.fn().mockResolvedValue({ user: { uid: "mock-user-id" } }),
    createUserWithEmailAndPassword: vi.fn().mockResolvedValue({ user: { uid: "mock-user-id" } }),
    signOut: vi.fn().mockResolvedValue({}),
  };
});

vi.mock("firebase/firestore", () => {
  return {
    getFirestore: vi.fn(),
  };
});

vi.mock("../src/lib/firebase/config", () => {
  return {
    auth: {},
    db: {},
  };
});

vi.mock("next/image", () => ({
  __esModule: true,
  default: (props: React.ImgHTMLAttributes<HTMLImageElement>) => <img {...props} />,
}));

vi.mock("next/link", () => ({
  __esModule: true,
  default: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  ),
}));

beforeEach(() => {
  vi.clearAllMocks();
});

describe("Pricing Page", () => {
  it("renders the Pricing Page correctly", () => {
    const queryClient = new QueryClient();

    render(
      <QueryClientProvider client={queryClient}>
        <PricingPage />
      </QueryClientProvider>
    );

    expect(screen.getByText("Join Our Audiology Survey Community")).toBeInTheDocument();
    expect(screen.getByText("Audiology Membership Plan")).toBeInTheDocument();
    expect(screen.getByText("$1 / Week")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /subscribe now/i })).toBeInTheDocument();
  });
});
