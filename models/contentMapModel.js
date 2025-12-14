import mongoose from "mongoose";

const contentMapSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
      unique: true, // one record per user
    },

    journeyTracker: {
      type: [String], // completed UUIDs in order
      default: [],
    },
  },
  { timestamps: true }
);

export default mongoose.model("contentMap", contentMapSchema);
