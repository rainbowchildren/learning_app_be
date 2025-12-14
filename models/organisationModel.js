import mongoose from "mongoose";

const org = new mongoose.Schema(
  {
    name: { type: String, required: true },
    location: { type: String },
    address: { type: String },
    website: { type: String },
    isActive: { type: Boolean, required: true },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Org", org);
