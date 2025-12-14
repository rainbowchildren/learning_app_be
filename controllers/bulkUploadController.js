import XLSX from "xlsx";
import fs from "fs";
import authModel from "../models/authModel.js";
import organisationModel from "../models/organisationModel.js";
import bcrypt from "bcryptjs";
import userModel from "../models/userModel.js";
import { generateJWT } from "../middlewares/authMiddleware.js";

export const createBulkUsers = async (req, res) => {
  try {
    const adminId = req.userId;
    if (!adminId) {
      return res.status(400).send({ mesage: "not valid admin" });
    }

    const orgId = await userModel
      .findOne({ _id: adminId })
      .select("organisation -_id");

    if (!orgId) {
      return res.status(400).send({
        message: "Organisation not associated. Please contact Super admin",
      });
    }
    if (!req.file) {
      return res
        .status(400)
        .send({ success: false, message: "No file uploaded" });
    }

    const workbook = XLSX.read(req.file.buffer, { type: "buffer" });
    const sheetName = workbook.SheetNames[0];
    const data = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], {
      defval: "",
      raw: false,
    });

    if (!data.length) {
      return res
        .status(400)
        .send({ success: false, message: "No data in file" });
    }
    // const orgId = "68ecff04917117c859ef4d09";
    const userPromises = data.map((row, idx) => {
      const payload = {
        username: row.username || row.Email || "",
        password: "1234",
        role: "student",
        orgId: "68ecff04917117c859ef4d09",
        // orgId: idx === data.length - 2 ? "68ecff04917117c859ef4d09" : orgId,
      };
      return createUserService(payload, true);
    });

    const results = await Promise.all(userPromises);
    console.log("results", results);
    const successUsers = results.filter((r) => r.success);
    const failedUsers = results.filter((r) => !r.success);
    console.log("failedUsers", failedUsers);
    res.status(200).json({
      total: results.length,
      created: successUsers.length,
      failed: failedUsers.map((f) => ({
        username: f.username,
        reason: f.message,
      })),
    });
  } catch (err) {
    console.error("createBulkUsers error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

export const createUserService = async (
  payload,
  requiredToChangePassword = false
) => {
  try {
    const { username, password, role, orgId } = payload;

    if (!username || !password || !role || !orgId) {
      return { success: false, username, message: "Missing required fields" };
    }

    const existingUser = await authModel.findOne({ username });
    if (existingUser) {
      return { success: false, username, message: "User already exists" };
    }

    const organisation = await organisationModel.findById(orgId);
    if (!organisation) {
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
      requiredToChangePassword: requiredToChangePassword ? true : false,
    });

    const userDoc = await userModel.create({
      auth: authDoc._id,
      organisation: orgId,
      role,
      username,
    });

    const token = await generateJWT(userDoc._id, role);
    console.log(token);
    if (token) {
      return {
        success: true,
        username,
        token,
        message: "User created successfully",
      };
    }
  } catch (e) {
    console.error("createUserService error:", e);
    return {
      success: false,
      username: payload.username || "",
      message: e.message,
    };
  }
};
