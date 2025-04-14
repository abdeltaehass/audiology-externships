import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import SignInPage from '../app/sign-in/page';
import { userService } from '@/service';

// Mocking the Next.js router
// For proper navigation between pages
const replaceMock = vi.fn();
vi.mock('next/navigation', () => ({
  useRouter: () => ({ replace: replaceMock }),
}));

// Mocking Firebase / Firestore functions
vi.mock('firebase/auth', () => ({
  getAuth: vi.fn().mockReturnValue({}),
  setPersistence: vi.fn().mockResolvedValue(undefined),
  browserLocalPersistence: {}, // Local Storage
  signInWithEmailAndPassword: vi.fn().mockResolvedValue({ user: { uid: 'mock-user-id' } }),
  createUserWithEmailAndPassword: vi.fn(),
  signOut: vi.fn(),
}));

vi.mock('firebase/firestore', () => ({
  getFirestore: vi.fn(),
}));

vi.mock('@/service', () => ({
  userService: {
    registerUser: vi.fn().mockResolvedValue({ uid: 'mock-user-id' }),
    getUserData: vi.fn().mockResolvedValue({ uid: 'mock-user-id', name: 'Test User' }),
    loginUser: vi.fn().mockResolvedValue({ uid: 'mock-user-id' }),
  },
}));

// Clearing the mocks before each test
beforeEach(() => {
  vi.clearAllMocks();
  replaceMock.mockReset();
});

// Tests
describe('Sign-In Page', () => {
  it('renders the Sign-In page components and text input fields', () => {
    render(<SignInPage />);

    expect(screen.getByText("Enter your email below to access your account.")).toBeInTheDocument();
    expect(screen.getByLabelText("Email")).toBeInTheDocument();
    expect(screen.getByLabelText("Password")).toBeInTheDocument();
    expect(screen.getByRole('button', { name: "Login" })).toBeInTheDocument();
  });

  it('allows the user to provide their credentials and get logged in', async () => {
    render(<SignInPage />);

    const emailInput = screen.getByLabelText("Email");
    const passwordInput = screen.getByLabelText("Password");
    const loginButton = screen.getByRole('button', { name: "Login" });

    // Dummy email and password values
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(loginButton);

    // Waiting to authenticate and login user
    await waitFor(() => {
      expect(userService.loginUser).toHaveBeenCalledWith('test@example.com', 'password123');
    });

    expect(replaceMock).toHaveBeenCalledWith('/'); // Redirect user to Home page once logged in
  });
});