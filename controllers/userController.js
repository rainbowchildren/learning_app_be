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
