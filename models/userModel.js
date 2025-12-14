import mongoose from "mongoose";
import { ROLES } from "../constants/constants.js";
const userSchema = new mongoose.Schema(
  {
    name: { type: String },
    phoneNumber: { type: String },
    username: { type: String },
    email: { type: String, unique: true },
    dob: { type: String },
    role: {
      type: String,
      enum: [ROLES.ADMIN, ROLES.OWNER, ROLES.STUDENT],
      required: true,
    },
    auth: { type: mongoose.Types.ObjectId, ref: "Auth", required: true },
    organisation: { type: mongoose.Types.ObjectId, ref: "Org" },
    profilePic: { type: String },
    completed: { type: Boolean },
  },

  { timestamps: true }
);

const userModel = mongoose.model("User", userSchema);

export default userModel;
