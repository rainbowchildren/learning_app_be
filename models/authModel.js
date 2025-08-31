import mongoose from "mongoose";

const authSchema = new mongoose.Schema(
  {
    username: { type: String, unique: true, required: true, index: true },
    email: { type: String, unique: true, required: true, index: true },
    phoneNumber: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    lastLogin: {},
  },
  { timeStamps: true }
);

export default mongoose.model("Auth", authSchema);
