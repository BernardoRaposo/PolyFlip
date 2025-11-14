import dbConnect from "@/lib/mongo";
import Card from "@/models/Card";

export async function GET(req) {
  await dbConnect();

  const { searchParams } = new URL(req.url);
  const lang = searchParams.get("lang");

  if (!lang) {
    return Response.json({ error: "Missing 'lang' parameter" }, { status: 400 });
  }

  const cards = await Card.find({ language: lang }).lean().limit(3);

  return Response.json(cards);
}
