// const { generateJWT } = require("../middlewares/authMiddleware");
// const authModel = require("../models/authModel");
// const { sendRes } = require("../utils/response");
// const bcrypt = require("bcryptjs");

import { generateJWT } from "../middlewares/authMiddleware.js";
import authModel from "../models/authModel.js";
import { sendRes } from "../utils/response.js";
import bcrypt from "bcryptjs";

export const createNewUser = async (req, res) => {
  try {
    const { username, email, phoneNumber, password } = req.body;
    console.log("coming to createnewuser");
    if (!username || !email || !phoneNumber || !password) {
      res.status(400).json({ message: "missing" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await new authModel({
      username,
      email,
      phoneNumber,
      password: hashedPassword,
    });
    console.log("newUser", newUser);
    const user = await newUser.save();

    const token = await generateJWT({ username });
    res.status(200).json({ message: user, token });
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

    const userRecordQuery = email ? { email } : { username };
    console.log("userRecordQuery", userRecordQuery);
    const userRecord = await authModel.findOne(userRecordQuery);
    console.log("userRecord", userRecord);
    if (!userRecord) {
      res.status(400).send({ message: "no user found" });
    }

    const authenticatePassword = await bcrypt.compare(
      password,
      userRecord.password
    );
    if (!authenticatePassword) {
      res.status(400).send({ message: "password is wrong" });
    }

    const token = await generateJWT();

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
export const resetPassword = async (req, res) => {
  try {
  } catch (e) {}
};
export const changePassword = async (req, res) => {
  try {
  } catch (e) {}
};

// module.exports = {
//   createNewUser,
//   usernameCheck,
//   login,
//   emailIdExist,
//   resetPassword,
//   changePassword,
// };
