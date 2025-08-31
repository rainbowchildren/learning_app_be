// const mongoose = require("mongoose");
import mongoose from "mongoose";
const userSchema = new mongoose.Schema(
  {
    firstName: {},
    lastName: {},
    dob: {},
    authId: {},
    profilePic: {},
  },

  { timestamps: true }
);

const userModel = mongoose.model("User", userSchema);

export default userModel;
