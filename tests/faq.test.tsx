import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import FAQPage from "@/app/faq/page";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

// Mock Firebase 
vi.mock("firebase/auth", () => ({
  getAuth: vi.fn().mockReturnValue({}),
  setPersistence: vi.fn().mockResolvedValue(undefined),
  browserLocalPersistence: {},
  signInWithEmailAndPassword: vi.fn().mockResolvedValue({ user: { uid: "mock-user-id" } }),
  createUserWithEmailAndPassword: vi.fn().mockResolvedValue({ user: { uid: "mock-user-id" } }),
  signOut: vi.fn().mockResolvedValue({}),
}));

vi.mock("firebase/firestore", () => ({
  getFirestore: vi.fn(),
}));

vi.mock("../src/lib/firebase/config", () => ({
  auth: {},
  db: {},
}));

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

const renderWithQueryClient = (ui: React.ReactElement) => {
  const queryClient = createTestQueryClient();
  return render(<QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>);
};

beforeEach(() => {
  vi.clearAllMocks();
});

//Test 1. Rendering page
describe("FAQPage", () => {
  it("renders all FAQ questions", () => {
    renderWithQueryClient(<FAQPage />);
    expect(
      screen.getByRole("heading", { name: /frequently asked questions/i })
    ).toBeInTheDocument();

    const questions = screen.getAllByRole("heading", { level: 2 });
    expect(questions.length).toBeGreaterThan(0);
  });

  //Test 2. Reveals and hide answer
  it("reveals and hides the answer when a question is clicked", () => {
    renderWithQueryClient(<FAQPage />);
    const firstQuestion = screen.getByText("What is Audiology Externship?");
    expect(screen.queryByText(/platform designed to help audiology/i)).toBeNull();

    fireEvent.click(firstQuestion);
    expect(screen.getByText(/platform designed to help audiology/i)).toBeInTheDocument();

    fireEvent.click(firstQuestion);
    expect(screen.queryByText(/platform designed to help audiology/i)).toBeNull();
  });

  //Test 3. One FAQ at a time
  it("only one FAQ is expanded at a time", () => {
    renderWithQueryClient(<FAQPage />);
    const question1 = screen.getByText("What is Audiology Externship?");
    const question2 = screen.getByText("How do I fill out a survey?");

    fireEvent.click(question1);
    expect(screen.getByText(/platform designed to help audiology/i)).toBeInTheDocument();

    fireEvent.click(question2);
    expect(screen.queryByText(/platform designed to help audiology/i)).toBeNull();
    expect(screen.getByText(/navigate to the 'Fill Out Survey' button/i)).toBeInTheDocument();
  });
});
