import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import dbConnect from "@/lib/mongo";
import User from "@/models/User";

export async function GET() {
  await dbConnect();

  const session = await getServerSession(authOptions);
  if (!session) {
    return new Response(JSON.stringify({ error: "Not authenticated" }), { status: 401 });
  }

  const user = await User.findOne({ email: session.user.email });

  if (!user) {
    return new Response(JSON.stringify({ error: "User not found" }), { status: 404 });
  }

  const level = Math.floor(user.xp / 100) + 1;

  return Response.json({
    xp: user.xp,
    level,
    streak: user.streak,
    lastPlayedAt: user.lastPlayedAt,
  });
}
