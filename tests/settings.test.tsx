// settings.test.tsx
import React from "react";
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Settings from '../app/settings/page';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { toast } from 'sonner'; // ✅ So we can spy on toast

// ✅ Mock next/navigation to avoid useRouter crash
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    refresh: vi.fn(),
    prefetch: vi.fn(),
  }),
}));

// ✅ Mock Firebase Firestore
vi.mock('firebase/firestore', () => ({
  doc: vi.fn(),
  updateDoc: vi.fn().mockResolvedValue(undefined),
  collection: vi.fn(),
  query: vi.fn(),
  where: vi.fn(),
  getDocs: vi.fn().mockResolvedValue({
    empty: false,
    docs: [
      {
        id: 'mock-user-id',
        data: () => ({ subscriptionId: 'mock-sub-id' }),
      },
    ],
  }),
}));

// Mock Firebase config
vi.mock('@/lib/firebase/config', () => ({
  db: {},
  auth: {
    currentUser: {
      uid: 'mock-user-id',
    },
  },
}));

// Mock toast from 'sonner'
vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

// Mock ProtectedRoute
vi.mock('@/components/protectedRoute', () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

beforeEach(() => {
  vi.clearAllMocks();
});

describe('Settings Page', () => {
  it('renders Cancel Subscription section correctly', () => {
    const queryClient = new QueryClient();
    render(
      <QueryClientProvider client={queryClient}>
        <Settings />
      </QueryClientProvider>
    );

    // Assert heading
    expect(screen.getByRole('heading', { name: 'Cancel Subscription' })).toBeInTheDocument();

    // Assert supporting paragraph text
    expect(screen.getByText(/Cancelling your subscription/i)).toBeInTheDocument();

    // Assert the cancel button
    expect(screen.getByRole("button", { name: /Cancel Subscription/i })).toBeInTheDocument();
  });

  it('opens confirmation dialog and cancels subscription', async () => {
    const queryClient = new QueryClient();
    render(
      <QueryClientProvider client={queryClient}>
        <Settings />
      </QueryClientProvider>
    );

    // Click to open dialog
    fireEvent.click(screen.getByRole("button", { name: /Cancel Subscription/i }));

    // Wait for dialog to show
    expect(await screen.findByText(/Are you sure you want to cancel/i)).toBeInTheDocument();

    // Confirm cancellation
    fireEvent.click(screen.getByRole("button", { name: /Confirm/i }));

    // Expect toast success
    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith("Subscription canceled successfully.");
    });
  });
});
