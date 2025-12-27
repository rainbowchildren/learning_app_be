import { speakBagEmpathy } from "../helpers/pollyHelper.js";
import { getPresignedUrl, uploadFile } from "../helpers/s3Service.js";
import {
  startTranscriptionJob,
  getTranscriptionResult,
} from "../helpers/transcribe.js";
import axios from "axios";

export const uploadS3 = async (req, res) => {
  try {
    // multer puts the file in req.file
    const file = req.file;
    if (!file) return res.status(400).json({ message: "No file uploaded" });

    // later: upload file.buffer to S3
    console.log(file.originalname, file.mimetype, file.size);

    res.json({ message: "File received successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Something went wrong" });
  }
};

/**
 * POST /transcribe
 * FE sends audio file (multipart/form-data)
 * {
    "success": true,
    "jobName": "transcribe-1766831420024",
    "s3Key": "recordings/audio-1766831419341.webm"
}
 */

export const uploadAndStartTranscription = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Audio file missing" });
    }

    // 1️⃣ Multer memory storage gives buffer
    const fileBuffer = req.file.buffer;

    // 2️⃣ Build S3 key
    const fileExt = req.file.originalname.split(".").pop();
    const s3Key = `recordings/audio-${Date.now()}.${fileExt}`;

    // 3️⃣ Upload buffer to S3
    await uploadFile(fileBuffer, s3Key); // 👈 IMPORTANT

    // 4️⃣ Build S3 URI
    const s3Uri = `s3://${process.env.AWS_BUCKET_NAME}/${s3Key}`;
    console.log("s3Uri", s3Uri);
    // 5️⃣ Start Transcribe job
    const jobName = `transcribe-${Date.now()}`;

    await startTranscriptionJob({
      jobName,
      s3Uri,
      languageCode: "en-IN",
    });

    return res.status(200).json({
      success: true,
      jobName,
      s3Key,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Transcription failed" });
  }
};

export const getTranscriptionStatus = async (req, res) => {
  try {
    const { jobName } = req.params;

    const result = await getTranscriptionResult(jobName);

    if (result.status !== "COMPLETED") {
      return res.status(200).json({
        success: true,
        status: result.status,
      });
    }

    // 1️⃣ Fetch transcript JSON
    const transcriptResponse = await axios.get(result.transcriptFileUri);

    // 2️⃣ Extract text
    const transcriptText =
      transcriptResponse.data.results.transcripts[0].transcript;

    return res.status(200).json({
      success: true,
      status: "COMPLETED",
      text: transcriptText,
    });
  } catch (error) {
    console.error("Get transcription error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch transcription result",
    });
  }
};

export const getBagEmpathyAudio = async (req, res) => {
  try {
    console.log(req.params);
    const { word } = req.params;
    if (!word) {
      res.status(401).json({ success: false, message: "Word is missing" });
    }
    const audioBuffer = await speakBagEmpathy(word);

    const s3Key = "polly/pronunciations/bag.mp3";

    await uploadFile(audioBuffer, s3Key, "audio/mpeg");

    const signedUrl = await getPresignedUrl(s3Key);

    res.json({
      success: true,
      audioUrl: signedUrl,
    });
  } catch (e) {
    res.status(500).json({ message: "Polly failed" });
  }
};
