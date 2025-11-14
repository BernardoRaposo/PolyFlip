import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    email: { type: String, unique: true, required: true },
    name: String,
    username: { type: String, default: null },
    image: String,

    // Onboarding
    dateOfBirth: String,
    targetLanguage: { type: String, default: null },

    // Progress system
    xp: { type: Number, default: 0 },
    streak: { type: Number, default: 0 },
    lastPlayedAt: { type: Date, default: null },
    wordsLearned: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.models.User || mongoose.model("User", UserSchema);
