import mongoose from "mongoose";

const CardSchema = new mongoose.Schema(
  {
    language: String,
    front: String,
    back: String,
  },
  { timestamps: true }
);

export default mongoose.models.Card || mongoose.model("Card", CardSchema);
