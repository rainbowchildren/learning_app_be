import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import authService from "./services/authService.js";
import questionService from "./services/questionService.js";
import userLevelProgress from "./services/userLevelProgress.js";
import { ROUTES } from "./routes/routes.js";

dotenv.config();

const app = express();

app.use(cors(["http://localhost:5173"]));
const PORT = process.env.PORT || 5000;

// Middleware to parse JSON
app.use(express.json());
// app.use("/auth", authService);
// app.use("/question", questionService);
// app.use("/levelProgress", userLevelProgress);

ROUTES.forEach((route) => {
  app.use(route.path, route.service);
});

mongoose
  .connect(
    "mongodb+srv://readingrainbowchildren:KijS7O0SvI7A73M3@reading-raibow.5j3q4zy.mongodb.net/?retryWrites=true&w=majority&appName=reading-raibow",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1);
  });

console.log("NODE_ENV", process.env.NODE_ENV);

// Sample route
app.get("/", (req, res) => {
  res.send("Hello from Express & MongoDB!");
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
