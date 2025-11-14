import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongo";
import User from "@/models/User";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function POST() {
  await dbConnect();
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const user = await User.findOne({ email: session.user.email });

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const lastPlayed = user.lastPlayedAt
    ? new Date(user.lastPlayedAt).setHours(0, 0, 0, 0)
    : null;

  let newStreak = user.streak;

  if (lastPlayed === null) {
    newStreak = 1; // first ever session
  } else {
    const diffDays = Math.floor(
      (today - lastPlayed) / (1000 * 60 * 60 * 24)
    );

    if (diffDays === 0) {
      // same day → streak stays
      newStreak = user.streak;
    } else if (diffDays === 1) {
      // consecutive day → +1
      newStreak = user.streak + 1;
    } else {
      // broke streak
      newStreak = 1;
    }
  }

  user.xp += 10;
  user.wordsLearned += 1;
  user.streak = newStreak;
  user.lastPlayedAt = new Date();

  await user.save();

  return NextResponse.json({
    xp: user.xp,
    streak: user.streak,
    wordsLearned: user.wordsLearned,
  });
}
