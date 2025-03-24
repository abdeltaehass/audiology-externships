// RegistrationPage:
// This page renders a centered user registration form using the <RegistationForm /> component.
// It provides a clean and responsive layout for new users to sign up.

import { RegistationForm } from "@/components/forms"; // Import the registration form component

export default function Page() {
  return (
    // Flex container to center the form both vertically and horizontally
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10 bg-neutral-100">
      {/* Constrained box to limit form width on larger screens */}
      <div className="w-full max-w-sm">
        {/* Render the reusable registration form */}
        <RegistationForm />
      </div>
    </div>
  );
}
