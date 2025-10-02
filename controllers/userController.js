import userModel from "../models/userModel.js";

export const getUser = async (req, res) => {
  try {
    const { userId } = req.body;

    const userDetails = await userModel.findOne({ authId: userId });
    console.log("userDetails", userDetails);
    res.status(200).send({ userDetails });
  } catch (e) {
    console.log(e);
  }
};

export const updateProfile = async (req, res) => {
  try {
    const updates = req.body; // { firstName, lastName, email, dob, phoneNumber, profilePic, role? }

    // Check for forbidden fields
    if (updates.role) {
      return res.status(400).json({ message: "Cannot update role." });
    }
    if (updates.authId) {
      return res.status(400).json({ message: "Cannot update authId." });
    }

    // if no valid fields provided
    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ message: "No valid fields to update." });
    }

    const updatedUser = await userModel.findByIdAndUpdate(
      "68dd302567ee1feda1160ca2",
      { $set: updates },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found." });
    }

    return res
      .status(200)
      .json({ message: "Profile updated successfully.", user: updatedUser });
  } catch (e) {
    console.error("Update profile error:", e);
    return res.status(500).json({ message: "Internal server error." });
  }
};
export const deleteProfile = async () => {};
