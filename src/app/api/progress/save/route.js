import dbConnect from "@/lib/mongo";
import Progress from "@/models/Progress";

export async function POST(req) {
  await dbConnect();
  const { userEmail, cardId, correct } = await req.json();

  const record = await Progress.findOne({ userEmail, cardId });

  if (!record) {
    await Progress.create({
      userEmail,
      cardId,
      correctAttempts: correct ? 1 : 0,
      wrongAttempts: correct ? 0 : 1,
    });
  } else {
    if (correct) record.correctAttempts++;
    else record.wrongAttempts++;
    await record.save();
  }

  return Response.json({ success: true });
}
