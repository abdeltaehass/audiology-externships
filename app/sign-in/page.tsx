//SIGN IN PAGE
/*This code defines a simple login page that centers a login form (<LoginForm />) on the screen with 
responsive padding and a light neutral background. It ensures the form is contained within a maximum 
width for consistent layout across devices. */
import { LoginForm } from "@/components/forms/login-form";

export default function Page() {
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10 bg-neutral-100">
      <div className="w-full max-w-sm">
        <LoginForm />
      </div>
    </div>
  );
}
