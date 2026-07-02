import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const { userId } = await auth();
  if (!userId) redirect("/login");

  return (
    <div>
      <h1 className="font-serif text-3xl font-medium text-sage-950 dark:text-white">
        Dashboard
      </h1>
      <p className="mt-2 text-sage-700 dark:text-sage-400">
        Welcome back. Replace this page with your app&apos;s main interface.
      </p>
    </div>
  );
}
