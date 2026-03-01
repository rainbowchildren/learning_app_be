import { Router } from "express";
import {
  getBagEmpathyAudio,
  getTranscriptionStatus,
  uploadAndStartTranscription,
  uploadS3,
} from "../controllers/cloudController.js";
import { upload } from "../middlewares/fileMiddleware.js";
import { s3, getPresignedUrl } from "../helpers/s3Service.js";
import { HeadObjectCommand } from "@aws-sdk/client-s3";
import dotenv from "dotenv";
dotenv.config();

const cloudService = Router();

cloudService.post("/upload", upload.single("file"), uploadS3);

cloudService.get("/media/:type/:fileName", async (req, res) => {
  try {
    const { type, fileName } = req.params;
    console.log("_DEBUG 1", { type, fileName });
    const key = `${type}/${fileName}`;
    console.log("_DEBUG 2", key);
    // Check file exists in S3
    try {
      await s3.send(
        new HeadObjectCommand({
          Bucket: process.env.AWS_BUCKET_NAME,
          Key: key,
        }),
      );
    } catch (err) {
      console.log(err);
      console.log("_DEBUG 3", err);
      console.log(
        "FROM S3",
        process.env.AWS_ACCESS_KEY_ID,
        process.env.AWS_SECRET_ACCESS_KEY,
        process.env.AWS_BUCKET_NAME,
        process.env.AWS_REGION,
      );
      return res
        .status(404)
        .json({ error: "File not found in S3", err: err.toString() });
    }

    const url = await getPresignedUrl(key);
    res.json({ url });
  } catch (err) {
    res.status(500).json({ error: "Failed to generate URL" });
  }
});

// cloudService.post("/synthesize", synthesizeSpeechController);

cloudService.post(
  "/transcribe",
  upload.single("audio"),
  uploadAndStartTranscription,
);

cloudService.get(
  "/getTranscribedText/:jobName",

  getTranscriptionStatus,
);

cloudService.get("/bag/empathy/:word", getBagEmpathyAudio);

export default cloudService;
