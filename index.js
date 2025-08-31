// index.js
// const express = require("express");
import express from "express";
// const mongoose = require("mongoose");
import mongoose from "mongoose";
// const dotenv = require("dotenv");
import dotenv from "dotenv";
// const cors = require("cors");
import cors from "cors";
// const authService = require("./services/authService");
import authService from "./services/authService.js";
import questionService from "./services/questionService.js";
import userLevelProgress from "./services/userLevelProgress.js";
// const { ROUTES } = require("./routes/routes");

dotenv.config();

const app = express();

app.use(cors(["http://localhost:5173"]));
const PORT = process.env.PORT || 5000;

// Middleware to parse JSON
app.use(express.json());
app.use("/auth", authService);
app.use("/question", questionService);
app.use("/levelProgress", userLevelProgress);
// ROUTES.forEach((route) => {
//   app.use(route.path, route.service);
// });
// MongoDB connection
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
