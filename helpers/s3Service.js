import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
  ListObjectsV2Command,
} from "@aws-sdk/client-s3";
import fs from "fs";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import dotenv from "dotenv";
dotenv.config();

// Initialize S3 client
const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});
console.log(
  "FROM S3",
  process.env.AWS_ACCESS_KEY_ID,
  process.env.AWS_SECRET_ACCESS_KEY,
  process.env.AWS_BUCKET_NAME,
  process.env.AWS_REGION
);
const BUCKET_NAME = process.env.AWS_BUCKET_NAME;

export const uploadFile = async (fileBuffer, key) => {
  const command = new PutObjectCommand({
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: key,
    Body: fileBuffer,
    ContentType: "audio/webm",
  });

  await s3.send(command);
};

// Helper: Download file
export const downloadFile = async (key, downloadPath) => {
  const command = new GetObjectCommand({
    Bucket: BUCKET_NAME,
    Key: key,
  });

  const response = await s3.send(command);
  const stream = response.Body;

  const chunks = [];
  for await (const chunk of stream) {
    chunks.push(chunk);
  }

  fs.writeFileSync(downloadPath, Buffer.concat(chunks));
  console.log(` Downloaded: ${key} → ${downloadPath}`);
};

// Helper: Delete file
export const deleteFile = async (key) => {
  const command = new DeleteObjectCommand({
    Bucket: BUCKET_NAME,
    Key: key,
  });

  await s3.send(command);
  console.log(`🗑 Deleted: ${key}`);
};

// Helper: List files in a prefix (folder)
export const listFiles = async (prefix = "") => {
  const command = new ListObjectsV2Command({
    Bucket: BUCKET_NAME,
    Prefix: prefix,
  });

  const response = await s3.send(command);
  return response.Contents?.map((item) => item.Key) || [];
};

// Helper: Get public URL for a file (bucket is public)
export const getPublicUrl = (key) => {
  return `https://${BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;
};

export const getPresignedUrl = async (key) => {
  const command = new GetObjectCommand({
    Bucket: BUCKET_NAME,
    Key: key,
  });

  // URL valid for 10 minutes → adjust as you want
  return await getSignedUrl(s3, command, { expiresIn: 600 });
};

export { s3 };
