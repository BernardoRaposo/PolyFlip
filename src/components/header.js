"use client";
import { motion, AnimatePresence } from "framer-motion";

export function Header({ streak = 0, userName = "User", streakUp = false, userImage = null }) {
  const badges = [
    { days: 5, icon: "🥉", label: "5-day streak" },
    { days: 10, icon: "🥈", label: "10-day streak" },
    { days: 15, icon: "🥇", label: "15-day streak" },
  ];

  // Photo fallback logic
  const avatarSrc = userImage
    ? userImage
    : "/placeholder-avatar.png"; // coloca aqui qualquer imagem que tenhas no /public

  return (
    <header className="w-full px-4 py-4 flex items-center justify-between">

      {/* PROFILE */}
      <div className="flex items-center gap-3">

        {/* Avatar rounded */}
        <div className="w-12 h-12 rounded-full overflow-hidden shadow-lg">
          <img
            src={avatarSrc}
            alt="User profile"
            className="w-full h-full object-cover"
          />
        </div>

        <div>
          <p className="text-sm text-muted-foreground">Hi, {userName}</p>
          <p className="font-bold text-foreground">Keep going!</p>
        </div>
      </div>

      {/* STREAK BADGE */}
      <div className="relative">
        <motion.div
          key={streak}
          initial={streakUp ? { scale: 1.3 } : { scale: 1 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 12 }}
          className="flex items-center gap-1 bg-orange-500 px-3 py-1.5 rounded-full shadow-md text-white font-bold"
        >
          <div className="flex gap-2">
            {badges.map((b) =>
              streak >= b.days ? (
                <motion.div
                  key={b.days}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-yellow-400 px-2 py-1 rounded-full text-sm shadow-sm"
                >
                  {b.icon}
                </motion.div>
              ) : null
            )}
          </div>
          <span className="text-lg">🔥</span>
          <span>{streak}</span>
        </motion.div>

        {/* Floating +1 Animation */}
        <AnimatePresence>
          {streakUp && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: -25 }}
              exit={{ opacity: 0, y: -45 }}
              transition={{ duration: 0.8 }}
              className="absolute left-1/2 -translate-x-1/2 text-orange-500 font-bold"
            >
              +1 day!
            </motion.div>
          )}
        </AnimatePresence>
      </div>

    </header>
  );
}
