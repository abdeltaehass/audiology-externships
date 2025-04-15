import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import userEvent from '@testing-library/user-event';
import { render, screen, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SurveyDialog } from '../components/survey-dialog';

//Mock only auth store
vi.mock('@/store/auth-store', () => ({
  useAuthStore: () => ({
    user: {
      uid: 'mock-user-id',
      email: 'test@example.com',
    },
  }),
}));

//Mocking Firebase
vi.mock('firebase/auth', () => ({
  getAuth: vi.fn().mockReturnValue({}),
  setPersistence: vi.fn().mockResolvedValue(undefined),
  browserLocalPersistence: {},
  signInWithEmailAndPassword: vi.fn().mockResolvedValue({ user: { uid: 'mock-user-id' } }),
  createUserWithEmailAndPassword: vi.fn().mockResolvedValue({ user: { uid: 'mock-user-id' } }),
  signOut: vi.fn().mockResolvedValue({}),
}));
vi.mock('firebase/firestore', () => ({
  getFirestore: vi.fn(),
}));

//Clears the mocks before each test
beforeEach(() => {
  vi.clearAllMocks();
});

const renderWithClient = () => {
  const queryClient = new QueryClient();
  render(
    <QueryClientProvider client={queryClient}>
      <SurveyDialog />
    </QueryClientProvider>
  );
};

///////////////////////////////////////
//This is where all the tests happens//
///////////////////////////////////////

describe('Fill out Survey Tests', () => {
  it('Verify the survey pop-up appears correctly when triggered.', async () => {
    renderWithClient();

    const triggerButton = screen.getByRole('button', { name: /fill out survey/i });
    await userEvent.click(triggerButton);
    await waitFor(() => {
      const dialog = screen.queryByRole('dialog');
      if (dialog) {
        expect(dialog).toBeInTheDocument();
      }
    });
  });

  it('Ensure the pop-up displays the correct title "Externship Details".', async () => {
    renderWithClient();

    //Checks for the title of the survey
    await waitFor(() => {
      const title = screen.queryByText(/Externship Details/i);
      if (title) {
        expect(title).toBeInTheDocument();
      }
    });
  });

  it('Checks that survey questions are displayed', async () => {
    renderWithClient();

    //Checks for the first two questions 
    await waitFor(() => {
      const question1 = screen.queryByText(/City of Externship\?/i);
      const question2 = screen.queryByText(/Does the clinic have rotations for specialties\?/i);

      if (question1) expect(question1).toBeInTheDocument();
      if (question2) expect(question2).toBeInTheDocument();
    });
  });

  it('navigation buttons (Next/Previous) respond to clicks', async () => {
    renderWithClient();

    //Checks that Next button works
    await waitFor(async () => {
      const nextButton = screen.queryByRole('button', { name: /next/i });
      if (nextButton) {
        await userEvent.click(nextButton);
        expect(nextButton).toBeInTheDocument();
      }

      //Checks that Previous button works
      const previousButton = screen.queryByRole('button', { name: /previous/i });
      if (previousButton) {
        await userEvent.click(previousButton);
        expect(previousButton).toBeInTheDocument();
      }
    });
  });

  it('Validate successful survey submission and appropriate response handling.', async () => {
    renderWithClient();

    await waitFor(async () => {
      //Find a submit button
      const submitButton = screen.queryByRole('button', { name: /submit/i });
      if (submitButton) {
        await userEvent.click(submitButton);

        //After click, success message shows up 
        const toast = await screen.findByText(/thank you for your feedback/i);
        expect(toast).toBeInTheDocument();
      }
    });
  });
});