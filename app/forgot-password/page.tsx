// FORGOT PASSWORD PAGE
// This page renders a centered form that allows users to initiate
// a password reset process. It uses a reusable <ForgotPasswordForm /> component
// and is styled to be responsive and user-friendly.

import { ForgotPasswordForm } from "@/components/forms/forgot-password"; // Import the reset form component

export default function Page() {
  return (
    // Fullscreen flex container to center the form vertically and horizontally
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10 bg-neutral-100">
      {/* Contained box for the form with a max width */}
      <div className="w-full max-w-sm">
        {/* Reusable password reset form */}
        <ForgotPasswordForm />
      </div>
    </div>
  );
}
