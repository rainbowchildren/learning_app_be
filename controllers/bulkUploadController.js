import XLSX from "xlsx";
import fs from "fs";
import authModel from "../models/authModel.js";
import organisationModel from "../models/organisationModel.js";
import bcrypt from "bcryptjs";
import userModel from "../models/userModel.js";
import { generateJWT } from "../middlewares/authMiddleware.js";
import { ROLES } from "../constants/constants.js";

export const createBulkUsers = async (req, res) => {
  try {
    const adminId = req.userId;

    if (!adminId) {
      return res.status(400).json({ message: "Invalid admin" });
    }

    // 1. Get admin + organisation
    const admin = await userModel.findById(adminId).select("organisation role");
    console.log("admin", admin);
    if (!admin || admin.role !== ROLES.ADMIN) {
      return res.status(403).json({ message: "Not an admin" });
    }

    if (!admin.organisation) {
      return res.status(400).json({
        message: "Organisation not associated. Contact super admin",
      });
    }

    // 2. File validation
    if (!req.file) {
      return res
        .status(400)
        .json({ success: false, message: "No file uploaded" });
    }

    // 3. Read Excel
    const workbook = XLSX.read(req.file.buffer, { type: "buffer" });
    const sheetName = workbook.SheetNames[0];
    const data = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], {
      defval: "",
      raw: false,
    });

    if (!data.length) {
      return res
        .status(400)
        .json({ success: false, message: "No data in file" });
    }

    // 4. Create students
    const userPromises = data.map((row) => {
      const payload = {
        username: row.username || row.Email || "",
        password: "1234",
        role: ROLES.STUDENT,
        organisation: admin.organisation,
        adminRef: adminId,
      };
      console.log("payload", payload);
      return createUserService(payload, true);
    });

    const results = await Promise.all(userPromises);

    const successUsers = results.filter((r) => r.success);
    const failedUsers = results.filter((r) => !r.success);

    // 5. Response
    res.status(200).json({
      success: true,
      total: results.length,
      created: successUsers.length,
      failed: failedUsers.map((f) => ({
        username: f.username,
        reason: f.message,
      })),
    });
  } catch (err) {
    console.error("createBulkUsers error:", err);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: err.message,
    });
  }
};

// export const createUserService = async (
//   payload,
//   requiredToChangePassword = false
// ) => {
//   try {
//     const { username, password, role, orgId } = payload;
//     console.log(username, password, role, orgId);
//     if (!username || !password || !role) {
//       return { success: false, username, message: "Missing required fields" };
//     }

//     const existingUser = await authModel.findOne({ username });
//     if (existingUser) {
//       return { success: false, username, message: "User already exists" };
//     }

//     const organisation = await organisationModel.findById(orgId);
//     if (!organisation) {
//       return {
//         success: false,
//         username,
//         message: "Organisation does not exist",
//       };
//     }

//     const hashedPassword = await bcrypt.hash(password, 10);
//     const authDoc = await authModel.create({
//       username,
//       password: hashedPassword,
//       requiredToChangePassword: requiredToChangePassword ? true : false,
//     });

//     const userDoc = await userModel.create({
//       auth: authDoc._id,
//       organisation: orgId,
//       role,
//       username,
//     });

//     const token = await generateJWT(userDoc._id, role);
//     console.log(token);
//     if (token) {
//       return {
//         success: true,
//         username,
//         token,
//         message: "User created successfully",
//       };
//     }
//   } catch (e) {
//     console.error("createUserService error:", e);
//     return {
//       success: false,
//       username: payload.username || "",
//       message: e.message,
//     };
//   }
// };

export const createUserService = async (
  payload,
  requiredToChangePassword = false
) => {
  try {
    const { username, password, role, organisation, adminRef } = payload;

    if (!username || !password || !role) {
      return { success: false, username, message: "Missing required fields" };
    }

    const existingUser = await authModel.findOne({ username });
    if (existingUser) {
      return { success: false, username, message: "User already exists" };
    }
    console.log("organisation", organisation);
    // validate organisation
    const orgExists = await organisationModel.findById(organisation);
    if (!orgExists) {
      return {
        success: false,
        username,
        message: "Organisation does not exist",
      };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const authDoc = await authModel.create({
      username,
      password: hashedPassword,
      requiredToChangePassword: !!requiredToChangePassword,
    });

    const userDoc = await userModel.create({
      auth: authDoc._id,
      username,
      role,
      organisation, // ✅ ObjectId saved
      adminRef, // ✅ admin linked
    });

    const token = await generateJWT(userDoc._id, role);

    return {
      success: true,
      username,
      token,
      message: "User created successfully",
    };
  } catch (e) {
    return {
      success: false,
      username: payload.username || "",
      message: e.message,
    };
  }
};
