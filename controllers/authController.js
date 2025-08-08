const user = require("../models/userModel");
//login
//signup
//getuserdetails
const createNewUser = async (req, res) => {
  try {
    const { email, name, password } = req.body;

    if (!email || !name || !password) {
      res
        .status("401")
        .send({ message: "email or name or password is missing" });
    }

    const existingUser = await user.findOne({ email });

    if (existingUser) {
      res.status(400).send({ message: "User already exists" });
    }
    const newUserRecord = new user({ email, name, password });

    await newUserRecord.save();

    res.status(200).send({ message: "Registered successfully" });
  } catch (e) {}
};

const authenticateUser = async (res, req) => {
  try {
  } catch (e) {
    console.log(e);
  }
};
const getUsers = async (req, res) => {
  const usersList = await user.find({});
  console.log("usersList", usersList);
  res.send("working");
};

module.exports = { createNewUser };
