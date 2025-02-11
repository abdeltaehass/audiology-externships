"use client";

import { Eye, EyeOff } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

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
import { userService } from "@/service";
import { useAuthStore } from "@/store/auth-store";
import { authErrors } from "@/constants/errors";

export function LoginForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const router = useRouter();
  const { user, signIn, signOut } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      const user = await userService.loginUser(email, password);
      if (!user) {
        toast.error("Login failed. Please try again.");
        return;
      }

      const userData = await userService.getUserData(user.uid);
      if (!userData) {
        toast.error("Login failed. Please try again.");
        return;
      }

      signIn(userData);

      toast.success("Logged in successfully!");
      router.replace("/");

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      const errorCode = error?.code as keyof typeof authErrors;
      toast.error(authErrors?.[errorCode] || "Login failed. Please try again.");
      console.log("errorCode", errorCode);
    } finally {
      setLoading(false);
    }
  };

  if (user) {
    return (
      <div className={cn("flex flex-col gap-6", className)} {...props}>
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">
              You are already logged in
            </CardTitle>
            <CardDescription>
              You can log out to switch accounts.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={signOut} className="w-full">
              Logout
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

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
          <CardTitle className="text-2xl">Login</CardTitle>
          <CardDescription>
            Enter your email below to access your account.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col gap-6">
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
              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    className="pr-10"
                    onChange={(e) => setPassword(e.target.value)}
                    value={password}
                    placeholder="••••••••"
                    required
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowPassword(!showPassword)}
                    size="icon"
                    className="absolute right-0.5 top-1/2 size-9 -translate-y-1/2 border-0 bg-transparent text-muted-foreground *:size-5 hover:text-accent-foreground"
                  >
                    {showPassword ? <EyeOff /> : <Eye />}
                  </Button>
                </div>
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Logging in..." : "Login"}
              </Button>
            </div>
            <div className="mt-4 text-center text-sm">
              Don&apos;t have an account?{" "}
              <Link href="/sign-up" className="underline underline-offset-4">
                Sign up
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
