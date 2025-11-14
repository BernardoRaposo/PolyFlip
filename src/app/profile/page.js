"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/button";

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [stats, setStats] = useState({
    streak: 0,
    xp: 0,
    level: 1,
  });

  const badges = [
    { id: "streak5", label: "🔥 5-Day Streak", unlocked: stats.streak >= 5 },
    { id: "streak10", label: "🔥 10-Day Streak", unlocked: stats.streak >= 10 },
    { id: "streak15", label: "🔥 15-Day Streak", unlocked: stats.streak >= 15 },
  ];

  // Redirect if not logged in
  useEffect(() => {
    if (status === "loading") return;
    if (!session) router.replace("/");
  }, [session, status, router]);

  // Fetch XP, streak, level
  useEffect(() => {
    if (!session) return;

    fetch("/api/game/status")
      .then((res) => res.json())
      .then((data) => {
        setStats({
          streak: data.streak || 0,
          xp: data.xp || 0,
          level: data.level || 1,
        });
      });
  }, [session]);

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  const user = session.user;

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-background to-secondary p-6">
      <div className="max-w-md mx-auto flex flex-col gap-6">
        
        {/* Header */}
        <div className="text-center mt-8">
          <div className="w-24 h-24 mx-auto mb-4 bg-primary rounded-3xl flex items-center justify-center shadow-2xl">
            <span className="text-5xl">👤</span>
          </div>
          <h1 className="text-3xl font-bold text-foreground">
            Your Profile
          </h1>
          <p className="text-muted-foreground text-sm">
            Manage your account and language preferences
          </p>
        </div>

        {/* Profile Card */}
        <div className="bg-card rounded-3xl shadow-xl p-6 flex flex-col gap-4">

          <div className="flex items-center gap-4">
            <img
              src={user.image}
              alt="Profile avatar"
              className="w-16 h-16 rounded-full shadow-lg"
            />
            <div>
              <p className="text-lg font-bold text-card-foreground">
                {user.username || user.name}
              </p>
              <p className="text-muted-foreground text-sm">{user.email}</p>
            </div>
          </div>

          <div className="border-t border-muted pt-4">
            <p className="text-sm font-bold text-card-foreground mb-1">
              Target Language
            </p>
            <p className="text-muted-foreground">
              {user.targetLanguage || "Not set"}
            </p>
          </div>

          <div>
            <p className="text-sm font-bold text-card-foreground mb-1">
              Date of Birth
            </p>
            <p className="text-muted-foreground">
              {user.dob || "Not set"}
            </p>
          </div>

          {/* 📌 Learning Progress Section */}
          <div className="bg-secondary rounded-2xl p-4 mt-2 flex flex-col gap-4 shadow-inner">

            <p className="text-sm font-bold text-card-foreground">
              Learning Progress
            </p>

            <div className="flex justify-between text-sm">
              <span>🔥 Streak:</span>
              <span className="font-bold">{stats.streak} days</span>
            </div>

            <div className="flex justify-between text-sm">
              <span>⭐ XP:</span>
              <span className="font-bold">{stats.xp}</span>
            </div>

            <div className="flex justify-between text-sm">
              <span>🏆 Level:</span>
              <span className="font-bold">{stats.level}</span>
            </div>

            {/* Badges */}
            <p className="text-sm font-bold mt-4">Badges</p>

            <div className="grid grid-cols-3 gap-3">
              {badges.map((badge) => (
                <div
                  key={badge.id}
                  className={`p-3 rounded-xl flex flex-col items-center justify-center text-center
                    ${badge.unlocked ? "bg-primary/20" : "bg-muted opacity-40 grayscale"}`}
                >
                  <div className="text-3xl mb-1">
                    {badge.unlocked ? "🏅" : "⚪"}
                  </div>
                  <p className="text-xs font-medium">{badge.label}</p>
                </div>
              ))}
            </div>

          </div>

        </div>

        {/* Buttons */}
        <div className="flex flex-col gap-3 mt-4">
          <Button 
            variant="primary"
            size="lg"
            onClick={() => router.push("/game")}
          >
            Continue Learning
          </Button>

          <Button 
            variant="secondary"
            size="lg"
            onClick={() => router.push("/onboarding")}
          >
            Edit Profile
          </Button>

          <Button 
            variant="error"
            size="lg"
            onClick={() => router.push("/api/auth/signout")}
          >
            Sign Out
          </Button>

        </div>

      </div>
    </div>
  );
}
