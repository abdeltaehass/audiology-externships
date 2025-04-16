//Sign-up test file

import React from "react";
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { RegistationForm } from '../components/forms/registration-form';

const replaceMock = vi.fn();
vi.mock('next/navigation', () => ({
  useRouter: () => ({ replace: replaceMock }),
  push: vi.fn(),
  refresh: vi.fn(),
  prefetch: vi.fn(),
}));

vi.mock('@/service', () => ({
  userService: {
    registerUser: vi.fn().mockResolvedValue({ uid: 'mock-user-id' }),
    getUserData: vi.fn().mockResolvedValue({ uid: 'mock-user-id', name: 'Test User' }),
  },
}));

// Mock Firebase
vi.mock('firebase/auth', () => ({
  getAuth: vi.fn().mockReturnValue({}),
  setPersistence: vi.fn().mockResolvedValue(undefined),
  browserLocalPersistence: {},
  signInWithEmailAndPassword: vi.fn(),
  createUserWithEmailAndPassword: vi.fn().mockResolvedValue({ user: { uid: 'mock-user-id' },}),
  signOut: vi.fn(),
}));

vi.mock('firebase/firestore', () => ({
  getFirestore: vi.fn(),
}));

beforeEach(() => {
  vi.clearAllMocks();
});

describe('Registration Form', () => {
  it('renders the registration form correctly', () => {
    render(<RegistationForm />);

    expect(screen.getByLabelText("Email")).toBeInTheDocument();
    expect(screen.getByLabelText("Password")).toBeInTheDocument();
    expect(screen.getByLabelText("Confirm Password")).toBeInTheDocument();
    expect(screen.getByRole('button', { name: "Sign up" })).toBeInTheDocument();
  });

  it('allows for successful registration', async () => {
    render(<RegistationForm />);
  
    const emailInput = screen.getByLabelText("Email");
    const passwordInput = screen.getByLabelText("Password");
    const confirmPasswordInput = screen.getByLabelText("Confirm Password");
    const signUpButton = screen.getByRole('button', { name: "Sign up" });
  
    // Input fields
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'validPassword123' } });
    fireEvent.change(confirmPasswordInput, { target: { value: 'validPassword123' } });

    expect(fireEvent.click(signUpButton));    
  });  
});
