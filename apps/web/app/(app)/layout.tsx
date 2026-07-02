import { UserButton } from "@clerk/nextjs";
import Link from "next/link";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-sage-50 dark:bg-sage-950">
      <header className="sticky top-0 z-50 border-b border-sage-200 bg-sage-50/80 backdrop-blur-md dark:border-sage-800 dark:bg-sage-950/80">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3">
          <Link
            href="/dashboard"
            className="font-serif text-lg font-medium text-sage-950 dark:text-white"
          >
            Template App
          </Link>
          <UserButton />
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-6 py-8">{children}</main>
    </div>
  );
}
