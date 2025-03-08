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
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      await sendPasswordResetEmail(auth, email, {
        url: "http://localhost:3000/change-password",
        handleCodeInApp: false,
      });
      setEmailSent(true);
      toast.success("Password reset email sent.");
    } catch (error) {
      const firebaseError = error as AuthError;
      setError(firebaseError.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
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
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Forgot Password</CardTitle>
          <CardDescription>
            Enter your email to reset your password.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {emailSent ? (
            // Show success message and navigation options
            <div className="flex flex-col gap-6 text-center">
              <p className="text-green-600">
                Password reset email has been sent. Please check your inbox.
              </p>
              <Link href="/sign-in">
                <Button className="w-full">Return to Sign In</Button>
              </Link>
            </div>
          ) : (
            // Show the email input form
            <form onSubmit={handleSubmit}>
              <div className="flex flex-col gap-6">
                {error && <p className="text-red-500 text-sm">{error}</p>}
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