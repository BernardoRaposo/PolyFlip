import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import dbConnect from "@/lib/mongo";
import User from "@/models/User";

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    }),
  ],

  callbacks: {
    async signIn({ user }) {
      await dbConnect();

      const existing = await User.findOne({ email: user.email });
        if (!existing) {
            await User.create({
                name: user.name,
                email: user.email,
                image: user.image,

                username: null,
                targetLanguage: null,
                dateOfBirth: null,

                xp: 0,
                streak: 0,
                wordsLearned: 0,
                lastPlayedAt: null,
            });
        }


      return true;
    },

    async session({ session }) {
      await dbConnect();

      const dbUser = await User.findOne({ email: session.user.email });

      // Attach DB fields to session
      session.user.id = dbUser._id.toString();
      session.user.username = dbUser.username;
      session.user.targetLanguage = dbUser.targetLanguage;
      session.user.dob = dbUser.dob || null;

      // NEW: Progress system fields
      session.user.xp = dbUser.xp;
      session.user.streak = dbUser.streak;
      session.user.wordsLearned = dbUser.wordsLearned;
      session.user.lastPlayedAt = dbUser.lastPlayedAt;

      return session;
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
