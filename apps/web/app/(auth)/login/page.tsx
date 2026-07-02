import { SignIn } from "@clerk/nextjs";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-sage-50 dark:bg-sage-950">
      <SignIn routing="hash" />
    </div>
  );
}
