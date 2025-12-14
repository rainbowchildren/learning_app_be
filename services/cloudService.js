import { Router } from "express";
import { uploadS3 } from "../controllers/cloudController.js";
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
    const key = `${type}/${fileName}`;
    // Check file exists in S3
    try {
      await s3.send(
        new HeadObjectCommand({
          Bucket: process.env.AWS_BUCKET_NAME,
          Key: key,
        })
      );
    } catch (err) {
      console.log(err);
      return res.status(404).json({ error: "File not found in S3" });
    }

    const url = await getPresignedUrl(key);
    res.json({ url });
  } catch (err) {
    res.status(500).json({ error: "Failed to generate URL" });
  }
});

export default cloudService;
