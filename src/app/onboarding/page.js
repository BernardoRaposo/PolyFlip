"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/button";
import { Input } from "@/components/input";

export default function OnboardingPage() {
  const { data: session } = useSession();
  const router = useRouter();

  const [formData, setFormData] = useState({
    username: "",
    dateOfBirth: "",
    targetLanguage: "",
  });

  const languages = [
    "Spanish",
    "French",
    "German",
    "Italian",
    "Portuguese",
    "Japanese",
    "Korean",
    "Mandarin Chinese",
    "Arabic",
    "Russian",
  ];

  // if not logged in → send back to login
useEffect(() => {
  if (session === null) {
    router.push("/");
  }
}, [session]);


const handleSubmit = async (e) => {
  e.preventDefault();

  const res = await fetch("/api/user/update", {
    method: "POST",
    body: JSON.stringify({
      email: session.user.email,
      username: formData.username,
      dateOfBirth: formData.dateOfBirth,
      targetLanguage: formData.targetLanguage,
    }),
  });

  if (res.ok) {
    // Refresh NextAuth session
    const event = new Event("visibilitychange");
    document.dispatchEvent(event);

    router.push("/game");
  }
};


  const isFormValid =
    formData.username && formData.dateOfBirth && formData.targetLanguage;

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-6 bg-gradient-to-b from-background to-secondary">
      <div className="w-full max-w-md bg-card rounded-3xl shadow-2xl p-8">
        
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto mb-4 bg-primary rounded-2xl flex items-center justify-center shadow-lg">
            <span className="text-3xl">✨</span>
          </div>
          <h1 className="text-3xl font-bold text-card-foreground mb-2">Let's get started!</h1>
          <p className="text-muted-foreground">Tell us a bit about yourself</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          
          <div>
            <label htmlFor="username" className="block text-sm font-bold mb-2">
              Username
            </label>
            <Input
              id="username"
              type="text"
              placeholder="Choose a username"
              value={formData.username}
              onChange={(e) =>
                setFormData({ ...formData, username: e.target.value })
              }
              required
            />
          </div>

          <div>
            <label htmlFor="dob" className="block text-sm font-bold mb-2">
              Date of Birth
            </label>
            <Input
              id="dob"
              type="date"
              value={formData.dateOfBirth}
              onChange={(e) =>
                setFormData({ ...formData, dateOfBirth: e.target.value })
              }
              required
            />
          </div>

          <div>
            <label htmlFor="language" className="block text-sm font-bold mb-2">
              I want to learn...
            </label>
            <select
              id="language"
              value={formData.targetLanguage}
              onChange={(e) =>
                setFormData({ ...formData, targetLanguage: e.target.value })
              }
              className="flex w-full rounded-xl border-2 px-4 py-3"
              required
            >
              <option value="">Select a language</option>
              {languages.map((lang) => (
                <option key={lang} value={lang}>
                  {lang}
                </option>
              ))}
            </select>
          </div>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="w-full mt-4"
            disabled={!isFormValid}
          >
            Continue
          </Button>
        </form>
      </div>
    </div>
  );
}
