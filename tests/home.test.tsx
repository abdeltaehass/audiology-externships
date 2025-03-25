//TODO: Move all Firebase mocks to a separate file during next Sprint for better organization.

import React from "react";
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import Home from '../app/page';
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

vi.mock('firebase/firestore', () => {
  return {
    getFirestore: vi.fn(),
  };
});

vi.mock('../src/lib/firebase/config', () => {
  return {
    auth: {},
    db: {},
  };
});

// Clearing the mocks before each test
beforeEach(() => {
  vi.clearAllMocks();
});

describe('Home Page', () => {
  it('renders the home page correctly', () => {
    const queryClient = new QueryClient();

    render(
      <QueryClientProvider client={queryClient}>
        <Home />
      </QueryClientProvider>
    );

    expect(screen.getByText('Discover & Share Audiology Externships')).toBeInTheDocument();
    expect(screen.getByText('Explore Audiology Externships')).toBeInTheDocument();

    expect(screen.getByText('Searching for externships?')).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Explore Externships/i })).toBeInTheDocument();

    expect(screen.getByText('Completed your externship?')).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Submit Externship/i })).toBeInTheDocument();
  });
});