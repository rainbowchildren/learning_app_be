import { ROLES } from "../constants/constants.js";
import userModel from "../models/userModel.js";

export const getUser = async (req, res) => {
  try {
    const id = req.userId;

    if (!id) {
      res.status(400).send({ message: "no user id provided" });
    }

    const userDetails = await userModel.findById(id).select("-_id -__v");

    if (!userDetails) {
      res.status(400).send({ message: "invalid user id. login again" });
    }

    res.status(200).send({ userDetails });
  } catch (err) {
    console.log(err);
    res.status(500).send({ message: err.message });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const newProfile = req.body; // { firstName, lastName, email, dob, phoneNumber, profilePic, role? }
    const userId = req.userId;
    const role = req.role;
    // Check for forbidden fields

    if (!userId) {
      return res.status(400).json({ message: "Cannot update authId." });
    }
    console.log(newProfile, req.body);
    // if no valid fields provided
    if (Object.keys(newProfile).length === 0) {
      return res.status(400).json({ message: "No valid fields to update." });
    }

    const requiredFields = [
      "name",
      "phoneNumber",
      "username",
      "email",
      "dob",
      "role",
      // "profilePic",
    ];
    const allFilled = requiredFields.every((field) => newProfile[field]);

    // Include `completed: true` if all fields filled
    if (allFilled) {
      newProfile.completed = true;
    } else {
      newProfile.completed = false;
    }

    const updatedUser = await userModel
      .findByIdAndUpdate(
        userId,
        { $set: newProfile },
        { new: true, runValidators: true }
      )
      .select("-_id -__v -auth");

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found." });
    }

    return res.status(200).json({
      message: "Profile updated successfully.",
      userDetails: updatedUser,
    });
  } catch (e) {
    console.error("Update profile error:", e);
    return res.status(500).json({ message: "Internal server error." });
  }
};
export const deleteProfile = async () => {};

export const getAllAdmins = async (req, res) => {
  try {
    const admins = await userModel
      .find({ role: ROLES.ADMIN })
      .select("-_id -__v -auth");
    res.status(200).json({
      success: true,
      message: admins.length
        ? "Admins fetched successfully"
        : "No Admins Found",
      data: admins,
    });
  } catch (err) {
    console.error("Error fetching admins:", err);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: err.message,
    });
  }
};
