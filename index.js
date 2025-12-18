import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";

import { ROUTES } from "./routes/routes.js";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const app = express();

// app.use(cors(["http://localhost:5173"]));
const allowedOrigins = [
  "http://localhost:5173",
  "https://rainbow-children-doo22pwcc-rainbowchildrens-projects.vercel.app",
];
app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

const PORT = process.env.PORT || 5000;

// const envFile =
//   process.env.ENV === "production" ? ".env.production" : ".env.development";
// dotenv.config({ path: path.resolve(process.cwd(), envFile) });

// Middleware to parse JSON
app.use(express.json());

ROUTES.forEach((route) => {
  app.use(route.path, route.service);
});

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1);
  });

// Sample route
app.get("/", (req, res) => {
  res.send("Hello from Express & MongoDB!");
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
