// FORGOT PASSWORD COMPONENT
// This component renders a form that allows users to request a password reset email.
// If the request is successful, a confirmation message is shown. The form uses Firebase Auth,
// React state for feedback, and the `sonner` toast system for notifications.

"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { sendPasswordResetEmail, AuthError } from "firebase/auth";
import { auth } from "@/lib/firebase";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";

export function ForgotPasswordForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  // Local component state
  const [email, setEmail] = useState("");         // User's email input
  const [error, setError] = useState("");         // Error message from Firebase
  const [loading, setLoading] = useState(false);  // Submission state
  const [emailSent, setEmailSent] = useState(false); // Tracks whether email was sent

  // Handles form submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Attempt to send password reset email using Firebase Auth
      await sendPasswordResetEmail(auth, email, {
        url: "http://localhost:3000/change-password", // Redirect URL (adjust for production)
        handleCodeInApp: false,
      });

      // Show success state
      setEmailSent(true);
      toast.success("Password reset email sent.");
    } catch (error) {
      // Handle Firebase errors
      const firebaseError = error as AuthError;
      setError(firebaseError.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      {/* Logo / Home link */}
      <Link href="/" className="font-semibold">
        <Image
          className="h-8 w-auto mx-auto"
          src="/logo-dark.png"
          alt="App Logo"
          width={32}
          height={32}
        />
      </Link>

      <Card>
        {/* Card header */}
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Forgot Password</CardTitle>
          <CardDescription>
            Enter your email to reset your password.
          </CardDescription>
        </CardHeader>

        <CardContent>
          {emailSent ? (
            // Success state view
            <div className="flex flex-col gap-6 text-center">
              <p className="text-green-600">
                Password reset email has been sent. Please check your inbox.
              </p>
              <Link href="/sign-in">
                <Button className="w-full">Return to Sign In</Button>
              </Link>
            </div>
          ) : (
            // Reset password form
            <form onSubmit={handleSubmit}>
              <div className="flex flex-col gap-6">
                {/* Error message if any */}
                {error && <p className="text-red-500 text-sm">{error}</p>}

                {/* Email input field */}
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="m@example.com"
                    required
                  />
                </div>

                {/* Submit button */}
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Sending..." : "Send Email"}
                </Button>
              </div>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
