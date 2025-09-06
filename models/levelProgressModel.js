import mongoose from "mongoose";

const answerSchema = new mongoose.Schema(
  {
    attempt: { type: Number },
    answerProvided: { type: mongoose.Schema.Types.Mixed },
    timeTaken: { type: Number },
  },
  { _id: false }
);

const journeySchema = new mongoose.Schema(
  {
    questionId: { type: String, required: true },
    attemptsTaken: { type: Number, default: 0 },
    status: { type: String, enum: ["completed", "inProgress"] },
    answers: [answerSchema],
  },
  { timestamps: true }
);

const levelProgressSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    userJourney: [journeySchema],
  },
  { timestamps: true }
);

export default mongoose.model("LevelProgress", levelProgressSchema);
