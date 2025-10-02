import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";

import { ROUTES } from "./routes/routes.js";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const app = express();

app.use(cors(["http://localhost:5173"]));
const PORT = process.env.PORT || 5000;

const envFile =
  process.env.ENV === "production" ? ".env.production" : ".env.development";
dotenv.config({ path: path.resolve(process.cwd(), envFile) });

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

// app.get("/testuploadAudio", async (req, res) => {
//   try {
//     const filePath = path.join(__dirname, "sampleAudio.m4a"); // file at root
//     const s3Key = "audio/sampleAudio.m4a"; // destination in S3 bucket

//     await uploadFile(filePath, s3Key);

//     res.status(200).send({ message: "✅ Audio uploaded successfully!" });
//   } catch (err) {
//     console.error("❌ Upload failed:", err);
//     res.status(500).send({ error: "Upload failed", details: err.message });
//   }
// });

// app.get("/getAudio/:fileKey", (req, res) => {
//   const { fileKey } = req.params;
//   const url = getPublicUrl(fileKey);
//   res.status(200).send({ url });
// });

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
