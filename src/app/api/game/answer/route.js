import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import dbConnect from "@/lib/mongo";
import User from "@/models/User";

export async function POST(req) {
  await dbConnect();
  const session = await getServerSession(authOptions);

  if (!session) {
    return new Response(
      JSON.stringify({ error: "Not authenticated" }),
      { status: 401 }
    );
  }

  const { correct } = await req.json(); // boolean

  const user = await User.findOne({ email: session.user.email });
  if (!user) {
    return new Response(
      JSON.stringify({ error: "User not found" }),
      { status: 404 }
    );
  }

  // if answer is wrong → do nothing
  if (!correct) {
    return Response.json({ ok: true, xp: user.xp, streak: user.streak });
  }

  // --- XP SYSTEM ---
  let newXP = user.xp + 10; // every correct answer = +10 XP

  // --- DAILY STREAK LOGIC ---
  const today = new Date();
  const lastPlay = user.lastPlayedAt ? new Date(user.lastPlayedAt) : null;

  let newStreak = user.streak;

  if (!lastPlay) {
    newStreak = 1;
  } else {
    const diffDays =
      Math.floor((today - lastPlay) / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      // same day → streak unchanged
    } else if (diffDays === 1) {
      // continued streak
      newStreak += 1;
    } else {
      // lost streak
      newStreak = 1;
    }
  }

  user.xp = newXP;
  user.streak = newStreak;
  user.lastPlayedAt = today;
  await user.save();

  return Response.json({
    ok: true,
    xp: newXP,
    streak: newStreak,
    level: Math.floor(newXP / 100) + 1,
  });
}
