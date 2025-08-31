import mongoose from "mongoose";
import levelProgress from "../models/levelProgress.js";
import authModel from "../models/authModel.js";

export const saveProgress = async (req, res) => {
  try {
    const { userId } = req.body;
    // const objectUserId = new mongoose.Types.ObjectId.createFromHexString(
    //   userId
    // );
    const findUserProgressRecord = await authModel.findOne({
      _id: userId,
    });
    console.log("findUserProgressRecord", findUserProgressRecord);

    if (!findUserProgressRecord) {
      res.status(200).send({ message: "no user found" });
    } else res.status(200).send({ message: "user found" });
  } catch (e) {
    console.log(e);
  }
};
