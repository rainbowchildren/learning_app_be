const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    username: { type: String, unique: true, required: true, index: true },
    email: { type: String, unique: true, required: true, index: true },
    phoneNumber: { type: String, unique: true, required: true },
    password: { type: String, required: true },
  },

  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
