import mongoose from "mongoose";

const levelProgressSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    userJourney: [
      {
        questionId: { type: String, required: true },
        attemptsTaken: { type: Number, default: 0 },
        answers: [
          {
            attempt: { type: Number },
            answerProvided: { type: mongoose.Schema.Types.Mixed },
            timeTaken: { type: Number },
          },
        ],
      },
    ],
  },
  { timestamps: { required: true } }
);

export default mongoose.model("levelProgress", levelProgressSchema);
