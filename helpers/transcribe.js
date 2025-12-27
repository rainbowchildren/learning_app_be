import {
  TranscribeClient,
  StartTranscriptionJobCommand,
  GetTranscriptionJobCommand,
} from "@aws-sdk/client-transcribe";
import dotenv from "dotenv";
dotenv.config();

const transcribeClient = new TranscribeClient({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

/**
 * Start transcription job
 */
export const startTranscriptionJob = async ({
  jobName,
  s3Uri,
  languageCode = "en-IN",
}) => {
  console.log("DEBUG", process.env.AWS_BUCKET_NAME);
  const command = new StartTranscriptionJobCommand({
    TranscriptionJobName: jobName,
    LanguageCode: languageCode,
    Media: {
      MediaFileUri: s3Uri,
    },
    //OutputBucketName: process.env.AWS_BUCKET_NAME, // can be same bucket
  });

  await transcribeClient.send(command);
  return { jobName };
};

/**
 * Get transcription result
 */
export const getTranscriptionResult = async (jobName) => {
  const command = new GetTranscriptionJobCommand({
    TranscriptionJobName: jobName,
  });

  const response = await transcribeClient.send(command);
  const job = response.TranscriptionJob;

  return {
    status: job.TranscriptionJobStatus, // IN_PROGRESS | COMPLETED | FAILED
    transcriptFileUri: job.Transcript?.TranscriptFileUri,
    failureReason: job.FailureReason,
  };
};
