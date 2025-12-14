import mongoose from "mongoose";

const progressSchema = new mongoose.Schema(
  {
    type: { type: String, enum: ["Exersice", "Question"], required: true },
    contentUUID: { type: String, required: true },
    userId: { type: mongoose.Types.ObjectId, ref: "user" },
    level: { type: String },
    exersiceSubLevelUUID: [{ type: String }],
    subLevel: {},
    feedbackType: { type: String },
    result: { type: Boolean },
    status: { type: String, enum: ["Completed", "Pending"], required: true },
  },
  { timestamps: true }
);

export default mongoose.model("progress", progressSchema);
