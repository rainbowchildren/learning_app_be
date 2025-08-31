import mongoose from "mongoose";

const answerSchema = new mongoose.Schema({
  questionRef: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "question",
    required: true,
  },
  answer: [
    {
      type: String,
      required: true,
    },
  ],
});

export default mongoose.model("answer", answerSchema);
