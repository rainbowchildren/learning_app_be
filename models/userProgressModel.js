import mongoose, { Schema } from "mongoose";

const userAnswerSchema = new mongoose.Schema({
  questionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Question",
    required: true,
  },
  responseType: {
    type: String,
    enum: ["tap", "drag-drop", "voice", "fill-in"],
    required: true,
  },
  attemptsTaken: { type: Number, default: 0 }, // total attempts
  maxAttempts: { type: Number, default: 2 },
  answerHistory: [
    {
      attemptNumber: { type: Number, required: true },
      answer: mongoose.Schema.Types.Mixed, // user response
      timestamp: { type: Date, default: Date.now },
      isCorrect: { type: Boolean, default: false }, // for each attempt
    },
  ],
  status: {
    type: String,
    enum: ["in-progress", "completed", "failed"],
    default: "in-progress",
  },
  completedAt: { type: Date }, // timestamp when question/exercise marked completed
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const history = new mongoose.Schema({
  attempt: { type: Number },
});

const userProgressSchema = new mongoose.Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  question: {
    type: Schema.Types.ObjectId,
    ref: "Question",
    required: true,
  },
  history: [history],
  status: {
    completed: { type: Boolean },
    inProgress: { type: Boolean },
  },
});

// Automatically update updatedAt
// userProgressSchema.pre("save", function (next) {
//   this.updatedAt = Date.now();
//   next();
// });

export default mongoose.model("UserProgress", userProgressSchema);
