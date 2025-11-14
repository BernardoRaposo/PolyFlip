import dbConnect from "@/lib/mongo";
import User from "@/models/User";

export async function POST(req) {
  await dbConnect();
  const body = await req.json();

  const { email, username, dateOfBirth, targetLanguage } = body;

  const updated = await User.findOneAndUpdate(
    { email },
    {
      $set: {
        username,
        dob: dateOfBirth,
        targetLanguage,
      },
      $setOnInsert: {
        xp: 0,
        streak: 0,
        lastPlayedAt: null,
        wordsLearned: 0,
      },
    },
    { new: true, upsert: true }
  );

  return Response.json({ ok: true, user: updated });
}
