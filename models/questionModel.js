import mongoose from "mongoose";

const questionSchema = new mongoose.Schema(
  {
    type: {
      type: [String],
      enum: ["exercise", "voice", "blanks", "drag_drop", "match", "tap"],
      required: true,
    },
    content: { type: mongoose.Schema.Types.Mixed },
    meta: {
      tags: {
        type: [String],
        enum: ["memorization"],
      },
      level: { type: Number, required: true, unique: true },
      globalIndex: { type: Number, required: true, unique: true },
      levelIndex: { type: Number, required: true, unique: true },
    },
  },
  { timestamps: true }
);

export default mongoose.model("Question", questionSchema);
