import { RegistationForm } from "@/components/forms";

export default function Page() {
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10 bg-neutral-100">
      <div className="w-full max-w-sm">
        <RegistationForm />
      </div>
    </div>
  );
}
