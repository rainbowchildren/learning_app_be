import mongoose from "mongoose";
import { ROLES } from "../constants/constants.js";
const userSchema = new mongoose.Schema(
  {
    name: { type: String },
    phoneNumber: { type: String },
    username: { type: String },
    email: { type: String },
    dob: { type: String },
    age: { type: Number },
    role: {
      type: String,
      enum: [ROLES.ADMIN, ROLES.OWNER, ROLES.STUDENT],
      required: true,
    },
    adminRef: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: function () {
        return this.role == ROLES.STUDENT;
      },
    },
    auth: { type: mongoose.Types.ObjectId, ref: "Auth", required: true },
    organisation: {
      type: mongoose.Types.ObjectId,
      ref: "Org",
      required: function () {
        return this.role === ROLES.ADMIN;
      },
    },
    profilePic: { type: String },
    completed: { type: Boolean },
  },

  { timestamps: true }
);

const userModel = mongoose.model("User", userSchema);

export default userModel;
