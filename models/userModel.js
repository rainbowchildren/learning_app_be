import mongoose from "mongoose";
import { ROLES } from "../constants/constants.js";
const userSchema = new mongoose.Schema(
  {
    firstName: { type: String },
    lastName: { type: String },
    phoneNumber: { type: String },
    email: { type: String, unique: true },
    dob: { type: String },
    role: {
      type: String,
      enum: [ROLES.ADMIN, ROLES.OWNER, ROLES.STUDENT],
    },
    authId: { type: mongoose.Types.ObjectId, required: true },
    profilePic: { type: String },
  },

  { timestamps: true }
);

const userModel = mongoose.model("User", userSchema);

export default userModel;
