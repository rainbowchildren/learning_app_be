import mongoose from "mongoose";
import { ROLES } from "../constants/constants.js";
import { generateJWT } from "../middlewares/authMiddleware.js";
import authModel from "../models/authModel.js";
import userModel from "../models/userModel.js";
import bcrypt from "bcryptjs";

export const createNewUser = async (req, res) => {
  try {
    const { username, password, role } = req.body;
    if (role === ROLES.OWNER) {
      res.status(400).send({ message: "owner cannot be created" });
    }
    if (!username || !password || !role) {
      res.status(400).json({ message: "missing" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const userAuth = new authModel({
      username,
      password: hashedPassword,
    });
    const savedUserAuth = await userAuth.save();
    let newUserRecord;

    if (savedUserAuth) {
      newUserRecord = new userModel({
        authId: savedUserAuth._id,
        role,
      });
      await newUserRecord.save();
    }
    console.log("newUserRecord", newUserRecord);
    const token = await generateJWT(newUserRecord._id, role);
    res.status(200).json({ message: "user created succesully", token });
  } catch (e) {
    console.log("createnewUser", e);
    res.status(500).json({ error: e.message });
  }
};

export const usernameCheck = async (req, res) => {
  try {
    const { username, email } = req.query;

    if (!username && !email) {
      res.status(400).json({ message: "username or email should be present" });
    }

    const userRecord = await authModel.findOne({
      $or: [{ email }, { username }],
    });

    res.status(200).json({ message: userRecord ? true : false });
  } catch (e) {
    console.log("createnewUser", e);
    res.status(500).json({ error: e.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, username, password } = req.body;

    if (!email && !username) {
      res.status(400).send({ message: "username or email is mandatory" });
    }

    const authQuery = email ? { email } : { username };
    console.log("userRecorauthQuerydQuery", authQuery);
    const authRecord = await authModel.findOne(authQuery);
    console.log("authRecord", authRecord);
    if (!authRecord) {
      res.status(400).send({ message: "no user found" });
    }

    const authenticatePassword = await bcrypt.compare(
      password,
      authRecord.password
    );
    if (!authenticatePassword) {
      res.status(400).send({ message: "password is wrong" });
    }

    const userData = await userModel.findOne({ authId: authRecord._id });
    console.log("userData", userData);
    const token = await generateJWT(userData._id, userData.role);

    res.status(200).send({ message: "Successfully authenticated", token });
  } catch (e) {
    console.log("createnewUser", e);
    res.status(500).json({ error: e.message });
  }
};
export const emailIdExist = async (req, res) => {
  try {
  } catch (e) {}
};

export const changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const userId = req.userId || "68dd302567ee1feda1160ca0"; // userId comes from JWT middleware

    if (!oldPassword || !newPassword) {
      return res
        .status(400)
        .json({ message: "Old and new passwords are required." });
    }

    const user = await authModel.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // check if old password is correct
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Old password is incorrect." });
    }

    // check if new password is different
    const isSame = await bcrypt.compare(newPassword, user.password);
    if (isSame) {
      return res
        .status(400)
        .json({ message: "New password cannot be the same as old password." });
    }

    // hash and set new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;

    await user.save();

    return res.status(200).json({ message: "Password changed successfully." });
  } catch (e) {
    console.error("Change password error:", e);
    return res.status(500).json({ message: "Internal server error." });
  }
};

export const requestPasswordReset = async (req, res) => {
  try {
    const { username } = req.body;

    if (!username) {
      return res.status(400).json({ message: "Username is required." });
    }

    const user = await authModel.findOne({ username }).select("_id username");
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }
    console.log("user", user);

    // generate JWT (short-lived)
    //const token = await generateJWT(); // adjust expiry as needed

    // in real app, send via email; for now return token in response
    return res
      .status(200)
      .json({ message: "Reset token generated.", userId: user._id });
  } catch (e) {
    console.error("Request reset password error:", e);
    return res.status(500).json({ message: "Internal server error." });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { id, newPassword } = req.body;

    if (!id || !newPassword) {
      return res
        .status(400)
        .json({ message: "Token and new password are required." });
    }
    const isValidObjectId = mongoose.Types.ObjectId.isValid(id);
    if (!isValidObjectId) {
      return res.status(404).json({ message: "not a valid id" });
    }
    const user = await authModel.findOne({ _id: id });
    console.log("user", user);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // check if new password is same as old
    // const isSame = await bcrypt.compare(newPassword, user.password);
    // if (isSame) {
    //   return res
    //     .status(400)
    //     .json({ message: "New password cannot be same as old password." });
    // }

    // hash and save new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;

    await user.save();

    return res.status(200).json({ message: "Password reset successfully." });
  } catch (e) {
    console.error("Reset password error:", e);
    return res.status(500).json({ message: "Internal server error." });
  }
};
// module.exports = {
//   createNewUser,
//   usernameCheck,
//   login,
//   emailIdExist,
//   resetPassword,
//   changePassword,
// };
