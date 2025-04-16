//Checkout test file

import React from 'react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent} from '@testing-library/react';
import CheckoutPage from '../app/checkout/page';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Mock Firebase functions
vi.mock('firebase/auth', () => {
  return {
    getAuth: vi.fn().mockReturnValue({}), // Mocking the getAuth
    setPersistence: vi.fn().mockResolvedValue(undefined), 
    browserLocalPersistence: {}, 
    signInWithEmailAndPassword: vi.fn().mockResolvedValue({ user: { uid: 'mock-user-id' } }),
    createUserWithEmailAndPassword: vi.fn().mockResolvedValue({ user: { uid: 'mock-user-id' } }),
    signOut: vi.fn().mockResolvedValue({}),
  };
});

vi.mock('firebase/firestore', () => ({
  getFirestore: vi.fn(),
  collection: vi.fn(),
  query: vi.fn(),
  where: vi.fn(),
  getDocs: vi.fn().mockResolvedValue({
    empty: false,
    docs: [{ id: 'mock-doc-id' }],
  }),
  doc: vi.fn(),
  updateDoc: vi.fn().mockResolvedValue(undefined),
  Timestamp: {
    fromDate: () => 'mock-timestamp',
  },
}));

vi.mock('@/lib/firebase/config', () => ({
  db: {},
  auth: {
    currentUser: { uid: 'mock-user-id' },
  },
}));

vi.mock('@/store/auth-store', () => ({
  useAuthStore: () => ({
    user: { uid: 'mock-user-id' },
  }),
}));
//Mocking PayPal buttons and functionality
vi.mock('@paypal/react-paypal-js', () => ({
  PayPalScriptProvider: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  PayPalButtons: ({ onApprove }: any) => {
    setTimeout(() => { //Approve order right away.
      onApprove?.({ orderID: 'mock-order-id' }, {
        order: {
          capture: async () => ({ id: 'mock-order-id' }),
        },
      });
    }, 0);
    return <button>Mock PayPal Button</button>;
  },
}));

// Clearing mocks, clean tests
beforeEach(() => {
  vi.clearAllMocks();
});

describe('Checkout Page', () => {
  it('renders the Checkout page correctly', () => {
    const queryClient = new QueryClient();

    render(
      <QueryClientProvider client={queryClient}>
        <CheckoutPage />
      </QueryClientProvider>
    );

    expect(screen.getByText("Checkout")).toBeInTheDocument();
    expect(screen.getByText("You are about to subscribe to the Audiology Membership Plan for $1/week.")).toBeInTheDocument();
    expect(screen.getByText("Mock PayPal Button")).toBeInTheDocument();
    expect(screen.getByRole('button', { name: "Cancel" })).toBeInTheDocument();
  });

  it('shows success after simulated PayPal approval', async () => {
    const queryClient = new QueryClient();

    render(
      <QueryClientProvider client={queryClient}>
        <CheckoutPage />
      </QueryClientProvider>
    );
    //User clicks
    const button = screen.getByText("Mock PayPal Button");
    fireEvent.click(button);
    //Appears once the user subscribes, PayPal mock
    const success = await screen.findByText("🎉 Subscription Successful!");
    expect(success).toBeInTheDocument();
  });
});