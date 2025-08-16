import JWT from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

console.log("process.env.SECRET_KEY_JWT", process.env.JWT_SECRET_KEY);

export const generateJWT = async () => {
  return await JWT.sign({}, process.env.JWT_SECRET_KEY, { expiresIn: "1h" });
};

export const verifyJWT = async () => {};
