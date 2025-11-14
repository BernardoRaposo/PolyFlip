import mongoose from "mongoose";

const ProgressSchema = new mongoose.Schema(
  {
    userEmail: String,
    cardId: mongoose.Schema.Types.ObjectId,
    correctAttempts: { type: Number, default: 0 },
    wrongAttempts: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.models.Progress ||
  mongoose.model("Progress", ProgressSchema);
