"use client";

import { useEffect, useRef, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

import { Header } from "@/components/header";
import { Flashcard } from "@/components/flashcard";
import { Input } from "@/components/input";
import { Button } from "@/components/button";
import { ProgressBar } from "@/components/progress-bar";
import { motion } from "framer-motion";
import confetti from "canvas-confetti";

export default function GamePage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [cards, setCards] = useState([]);
  const [current, setCurrent] = useState(0);
  const [userAnswer, setUserAnswer] = useState("");
  const [feedback, setFeedback] = useState(null);

  // ❌ REMOVIDO
  // const [streak, setStreak] = useState(0);

  // ✅ O ÚNICO STREAK CORRETO
  const [realStreak, setRealStreak] = useState(0);

  const [isFinished, setIsFinished] = useState(false);

  const [xp, setXp] = useState(0);
  const [level, setLevel] = useState(1);

  const [showXpGain, setShowXpGain] = useState(false);
  const [xpGain, setXpGain] = useState(0);

  const [showLevelUp, setShowLevelUp] = useState(false);
  const [streakUp, setStreakUp] = useState(false);


  // AUTH CHECKS
  useEffect(() => {
    if (status === "loading") return;

    if (!session) {
      router.replace("/");
      return;
    }

    if (!session.user.username || !session.user.targetLanguage) {
      router.replace("/onboarding");
      return;
    }
  }, [session, status]);

  // LOAD XP + STREAK
  useEffect(() => {
    if (!session) return;

    fetch("/api/game/status")
      .then((res) => res.json())
      .then((data) => {
        setXp(data.xp || 0);
        setRealStreak(data.streak || 0);
        setLevel(data.level || 1);
      });
  }, [session]);

  // AUTO-FOCUS
  const inputRef = useRef(null);

  useEffect(() => {
    if (inputRef.current) inputRef.current.focus();
  }, [current, feedback]);

  // LOAD CARDS
  useEffect(() => {
    if (status === "loading") return;

    if (!session) {
      router.replace("/");
      return;
    }

    const lang = session.user.targetLanguage;

    fetch(`/api/cards/get?lang=${lang}`)
      .then((res) => res.json())
      .then((data) => {
        setCards(data);
      });
  }, [session, status]);

  if (!session || cards.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading game…</p>
      </div>
    );
  }

  const card = cards[current];

  // HANDLE SUBMIT
  const handleSubmit = async (e) => {
    e.preventDefault();

    const correct =
      userAnswer.toLowerCase().trim() === card.back.toLowerCase().trim();

    setFeedback(correct ? "correct" : "incorrect");

      const previousStreak = realStreak;


    try {
      const res = await fetch("/api/game/answer", {
        method: "POST",
        body: JSON.stringify({ correct }),
      });

      const data = await res.json();

      if (res.ok && correct) {
        const previousLevel = level;

        setXp(data.xp);
        setRealStreak(data.streak);
        setLevel(data.level);

          // 🌟 DETECT STREAK UP
          if (data.streak > previousStreak) {
            setStreakUp(true);
            setTimeout(() => setStreakUp(false), 1200);
          }

        // LEVEL UP
        if (data.level > previousLevel) {
          setShowLevelUp(true);

          // Confetti
          confetti({
            particleCount: 150,
            spread: 80,
            startVelocity: 45,
            origin: { y: 0.7 },
          });

          setTimeout(() => {
            confetti({
              particleCount: 120,
              spread: 100,
              startVelocity: 35,
              ticks: 120,
              scalar: 0.9,
              origin: { y: 0.3 },
            });
          }, 250);
        }

        // XP ANIMATION
        setXpGain(10);
        setShowXpGain(true);

        setTimeout(() => {
          setShowXpGain(false);
        }, 1000);
      }
    } catch (err) {
      console.error("Failed updating progress:", err);
    }

    // NEXT CARD / FINISH
    setTimeout(() => {
      if (correct) {
        if (current < cards.length - 1) {
          setCurrent((c) => c + 1);
        } else {
          setIsFinished(true);
        }
      }

      setUserAnswer("");
      setFeedback(null);
    }, 1600);
  };

  return (
    <div className="min-h-screen w-full flex flex-col bg-gradient-to-b from-background to-secondary">

      {/* Header */}
      <Header
        streak={realStreak}
        userName={session.user.username}
        streakUp={streakUp}
        userImage={session.user.image}
      />

      {/* Progress */}
      <div className="px-4 mt-3 mb-4">
        <ProgressBar value={current + 1} max={cards.length} />
        <p className="text-xs text-muted-foreground text-center mt-1">
          {current + 1} / {cards.length}
        </p>
      </div>

      {/* Game Body */}
      <div className="flex-1 w-full flex flex-col items-center px-4 pb-10">
        <div className="w-full max-w-md flex flex-col items-center">

          <div className="w-full flex justify-center mt-10 mb-10">
            <Flashcard front={card.front} back={card.back} />
          </div>

          <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4">
            <Input
              ref={inputRef}
              type="text"
              placeholder="Type the translation..."
              value={userAnswer}
              disabled={feedback !== null}
              onChange={(e) => setUserAnswer(e.target.value)}
              className={
                feedback === "correct"
                  ? "border-success"
                  : feedback === "incorrect"
                  ? "border-error"
                  : ""
              }
            />

            {showXpGain && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.8 }}
                animate={{ opacity: 1, y: -20, scale: 1 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="text-green-500 font-bold text-lg text-center"
              >
                +{xpGain} XP
              </motion.div>
            )}

            <Button
              type="submit"
              variant={
                feedback === "correct"
                  ? "success"
                  : feedback === "incorrect"
                  ? "error"
                  : "primary"
              }
              disabled={!userAnswer.trim() || feedback !== null}
            >
              {feedback === "correct"
                ? "✓ Correct!"
                : feedback === "incorrect"
                ? "✗ Try again!"
                : "Check Answer"}
            </Button>
          </form>
        </div>
      </div>

      {/* Finished Modal */}
      {isFinished && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-card rounded-3xl p-8 shadow-xl text-center w-80">
            <div className="text-6xl mb-4">🎉</div>
            <h2 className="text-3xl font-bold mb-2">Parabéns!</h2>
            <p className="text-muted-foreground mb-6">
              Completaste todos os flashcards de hoje!
            </p>

            <Button onClick={() => router.push("/profile")} className="w-full mb-3">
              Voltar ao menu
            </Button>

            <Button
              variant="secondary"
              className="w-full"
              onClick={() => {
                setCurrent(0);
                setUserAnswer("");
                setFeedback(null);
                setIsFinished(false);
                setRealStreak(0); // RESET CORRETO
              }}
            >
              Jogar novamente
            </Button>
          </div>
        </div>
      )}

      {/* Level Up Modal */}
      {showLevelUp && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-3xl p-8 text-center shadow-2xl max-w-sm w-full animate-scaleIn">
            <div className="text-6xl mb-4">🎉</div>
            <h2 className="text-3xl font-bold mb-2 text-foreground">Level Up!</h2>
            <p className="text-lg text-muted-foreground mb-6">
              You reached <span className="font-bold">Level {level}</span>!
            </p>
            <button
              onClick={() => setShowLevelUp(false)}
              className="w-full px-6 py-3 rounded-xl bg-primary text-white font-semibold text-lg shadow-md active:scale-95"
            >
              Continue
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
