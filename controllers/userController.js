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
    const admins = await userModel.aggregate([
      { $match: { role: ROLES.ADMIN } },

      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "adminRef",
          as: "students",
        },
      },

      {
        $lookup: {
          from: "orgs",
          localField: "organisation",
          foreignField: "_id",
          as: "organisation",
        },
      },

      {
        $project: {
          _id: 0,
          username: 1,
          role: 1,
          createdAt: 1,
          updatedAt: 1,
          organisation: { $arrayElemAt: ["$organisation.name", 0] },
          studentCount: { $size: "$students" },
        },
      },
    ]);

    res.status(200).json({
      success: true,
      message: admins.length
        ? "Admins fetched successfully"
        : "No Admins Found",
      data: admins,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: err.message,
    });
  }
};

export const deleteAdmin = async (req, res) => {
  const { adminId } = req.params;
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    // 1. Find admin
    const admin = await userModel.findById(adminId).session(session);
    if (!admin || admin.role !== ROLES.ADMIN) {
      throw new Error("Admin not found");
    }

    // 2. Delete students under this admin
    await userModel.deleteMany(
      { adminRef: adminId, role: ROLES.STUDENT },
      { session }
    );

    // 3. Delete organisation
    if (admin.organisation) {
      await mongoose
        .model("Org")
        .findByIdAndDelete(admin.organisation, { session });
    }

    // 4. Delete admin
    await userModel.findByIdAndDelete(adminId, { session });

    await session.commitTransaction();
    session.endSession();

    res.status(200).json({
      success: true,
      message: "Admin and all related data deleted successfully",
    });
  } catch (err) {
    await session.abortTransaction();
    session.endSession();

    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

export const getMyStudents = async (req, res) => {
  try {
    const adminId = req.userId;

    const students = await userModel
      .find({
        role: ROLES.STUDENT,
        adminRef: adminId,
      })
      .select("-__v -auth")
      .lean();

    res.status(200).json({
      success: true,
      message: students.length
        ? "Students fetched successfully"
        : "No students found",
      data: students,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: err.message,
    });
  }
};
