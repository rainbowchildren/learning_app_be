// const mongoose = require("mongoose");
import mongoose from "mongoose";
const userSchema = new mongoose.Schema(
  {
    firstName: { type: String },
    lastName: { type: String },
    phoneNumber: { type: String },
    email: { type: String, unique: true },
    dob: { type: String },
    authId: { type: mongoose.Types.ObjectId, required: true },
    profilePic: { type: String },
  },

  { timestamps: true }
);

const userModel = mongoose.model("User", userSchema);

export default userModel;
