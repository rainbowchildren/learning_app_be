import JWT from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

console.log("process.env.SECRET_KEY_JWT", process.env.JWT_SECRET_KEY);

export const generateJWT = async (userId, role) => {
  return await JWT.sign({ userId, role }, process.env.JWT_SECRET_KEY, {
    expiresIn: "6h",
  });
};

export const verifyJWTMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Token invalid" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = JWT.verify(token, process.env.JWT_SECRET_KEY);

    if (!decoded.userId || !decoded.role) {
      return res.status(401).json({ message: "Token invalid" });
    }

    req.userId = decoded.userId;
    req.role = decoded.role;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Token invalid" });
  }
};
