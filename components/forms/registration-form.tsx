// REGISTRATION FORM COMPONENT
// This component renders a registration form for new users to sign up for the Audiology Externships platform.
// It collects email and password inputs, validates password confirmation, and uses Firebase-based userService
// to register and authenticate the user. It also includes password visibility toggles and error handling.

"use client";

import { Eye, EyeOff } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { authErrors } from "@/constants/errors";
import { userService } from "@/service";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth-store";

export function RegistationForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const router = useRouter();
  const { signIn } = useAuthStore();

  // State hooks for form fields and behavior
  const [loading, setLoading] = React.useState(false);
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [showPassword, setShowPassword] = React.useState({
    password: false,
    confirmPassword: false,
  });

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Passwords must match before proceeding
    if (password !== confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }

    setLoading(true);

    try {
      // Register the user with Firebase
      const user = await userService.registerUser(email, password);
      if (!user) {
        toast.error("Registration failed. Please try again.");
        return;
      }

      // Fetch additional user data from database
      const userData = await userService.getUserData(user.uid);
      if (!userData) {
        toast.error("Registration failed. Please try again.");
        return;
      }

      // Store user in global auth store
      signIn(userData);

      toast.success("Registration successful!");
      router.replace("/"); // Redirect to homepage
    } catch (error: any) {
      console.log("error", error);
      const errorCode = error?.code as keyof typeof authErrors;
      toast.error(
        authErrors?.[errorCode] || "Registration failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      {/* Logo linking to home */}
      <Link href="/" className="font-semibold">
        <Image
          className="h-8 w-auto mx-auto"
          src="/logo-dark.png"
          alt="Audiology Externships"
          width={32}
          height={32}
        />
      </Link>

      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Sign up</CardTitle>
          <CardDescription>
            Enter your email and password to create an account
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col gap-6">
              {/* Email input */}
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  onChange={(e) => setEmail(e.target.value)}
                  value={email}
                  placeholder="m@example.com"
                  required
                />
              </div>

              {/* Password input with visibility toggle */}
              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword.password ? "text" : "password"}
                    className="pr-10"
                    placeholder="••••••••"
                    onChange={(e) => setPassword(e.target.value)}
                    value={password}
                    required
                  />
                  <Button
                    name="password"
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() =>
                      setShowPassword({
                        ...showPassword,
                        password: !showPassword.password,
                      })
                    }
                    className="absolute right-0.5 top-1/2 size-9 -translate-y-1/2 border-0 bg-transparent text-muted-foreground *:size-5 hover:text-accent-foreground"
                  >
                    {showPassword.password ? <EyeOff /> : <Eye />}
                  </Button>
                </div>
              </div>

              {/* Confirm password input with toggle */}
              <div className="grid gap-2">
                <Label htmlFor="password">Confirm Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword.confirmPassword ? "text" : "password"}
                    className="pr-10"
                    placeholder="••••••••"
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    value={confirmPassword}
                    required
                  />
                  <Button
                    name="password"
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() =>
                      setShowPassword({
                        ...showPassword,
                        confirmPassword: !showPassword.confirmPassword,
                      })
                    }
                    className="absolute right-0.5 top-1/2 size-9 -translate-y-1/2 border-0 bg-transparent text-muted-foreground *:size-5 hover:text-accent-foreground"
                  >
                    {showPassword.confirmPassword ? <EyeOff /> : <Eye />}
                  </Button>
                </div>
              </div>

              {/* Submit button */}
              <Button type="submit" className="w-full" loading={loading}>
                Sign up
              </Button>
            </div>

            {/* Link to login page */}
            <div className="mt-4 text-center text-sm">
              Already have an account?{" "}
              <Link href="/sign-in" className="underline underline-offset-4">
                Sign in
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
