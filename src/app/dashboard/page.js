"use client";

import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return;

    // Not logged in → back to login
    if (!session) {
      router.replace("/");
      return;
    }

    // User logged in but no onboarding → onboarding
    if (!session.user.targetLanguage) {
      router.replace("/onboarding");
      return;
    }

    // User already completed onboarding → game
    router.replace("/game");
  }, [session, status, router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-center text-lg">Loading your profile...</p>
    </div>
  );
}
