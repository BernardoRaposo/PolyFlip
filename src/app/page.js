"use client";

import { Button } from "@/components/button";
import { signIn } from "next-auth/react";

export default function LoginPage() {
  return (
    
    <div className="min-h-screen w-full flex flex-col items-center justify-center relative overflow-hidden">

      {/* 🔥 BACKGROUND LAYERS */}
      <div className="aurora-bg"></div>
      <div className="blob blob-1"></div>
      <div className="blob blob-2"></div>

      {/* MAIN CONTENT */}
      <div className="w-full max-w-md flex flex-col items-center gap-8 z-10 p-6">

        {/* Logo */}
        <div className="text-center">
          <div className="w-24 h-24 mx-auto mb-4 bg-primary rounded-3xl flex items-center justify-center shadow-2xl">
            <span className="text-5xl">📚</span>
          </div>
          <h1 className="text-4xl font-bold text-foreground mb-2">PolyFlip</h1>
          <p className="text-lg text-muted-foreground">
            Learn languages, one flip at a time
          </p>
        </div>

        {/* Buttons */}
        <div className="w-full flex flex-col gap-3">
          <Button
            variant="primary"
            size="lg"
            onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
            className="w-full flex items-center justify-center gap-3"
          >
            Login with Google
          </Button>
        </div>

        <p className="text-sm text-muted-foreground text-center px-8">
          By continuing, you agree to our Terms of Service and Privacy Policy
        </p>

      </div>
    </div>
  );
}
