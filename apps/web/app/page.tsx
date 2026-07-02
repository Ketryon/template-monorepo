import Link from "next/link";

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-8 bg-sage-50 px-6 dark:bg-sage-950">
      <h1 className="font-serif text-5xl font-medium tracking-tight text-sage-950 dark:text-white">
        Template App
      </h1>
      <p className="max-w-md text-center text-lg text-sage-700 dark:text-sage-400">
        Ketryon Monorepo Template — Next.js web + Express backend + Inngest
        worker. Replace this with your app.
      </p>
      <div className="flex gap-4">
        <Link
          href="/login"
          className="rounded-full bg-sage-950 px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-sage-800 dark:bg-sage-300 dark:text-sage-950 dark:hover:bg-sage-200"
        >
          Sign in
        </Link>
        <Link
          href="/signup"
          className="rounded-full bg-sage-950/10 px-6 py-2.5 text-sm font-medium text-sage-950 transition-colors hover:bg-sage-950/15 dark:bg-white/10 dark:text-white dark:hover:bg-white/20"
        >
          Create account
        </Link>
      </div>
    </main>
  );
}
