import mongoose from "mongoose";

const questionsSchema = new mongoose.Schema(
  {
    questionId: { type: String, unique: true, required: true },
    // question: { type: String, required: true },
    // questionType: { type: String, required: true, default: "" },
    // questionConfig: { type: mongoose.Schema.Types },
    // mediaLinks: [
    //   {
    //     url: { type: String, required: true },
    //     type: { type: String },
    //   },
    // ],
  },
  { timestamps: true }
);

export default mongoose.model("question", questionsSchema);
