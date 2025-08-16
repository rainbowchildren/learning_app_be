// index.js
const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const authService = require("./services/authService");
const { ROUTES } = require("./routes/routes");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware to parse JSON
app.use(express.json());
app.use("/auth", authService);
// ROUTES.forEach((route) => {
//   app.use(route.path, route.service);
// });
// MongoDB connection
mongoose
  .connect("mongodb://localhost:27017/learning_app_local", {
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
