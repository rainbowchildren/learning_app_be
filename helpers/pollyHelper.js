import { PollyClient, SynthesizeSpeechCommand } from "@aws-sdk/client-polly";
import dotenv from "dotenv";

dotenv.config();

const polly = new PollyClient({
  region: process.env.AWS_REGION,
});

const BAG_EMPATHY_SSML = (word) => {
  return `
<speak>
  <prosody rate="slow">
    That's okay.
  </prosody>

  <break time="400ms"/>

  <prosody rate="slow">
    Let's say it together.
  </prosody>

  <break time="600ms"/>

  <prosody rate="x-slow">
    ${word}
  </prosody>

  <break time="500ms"/>

  <prosody rate="slow">
     ${word}
  </prosody>
</speak>

`;
};

const streamToBuffer = async (stream) => {
  const chunks = [];
  for await (const chunk of stream) chunks.push(chunk);
  return Buffer.concat(chunks);
};

export const speakBagEmpathy = async (word) => {
  console.log("BAG_EMPATHY_SSML(word)", BAG_EMPATHY_SSML(word), word);
  const command = new SynthesizeSpeechCommand({
    TextType: "ssml",
    Text: BAG_EMPATHY_SSML(word),
    OutputFormat: "mp3",
    VoiceId: "Joanna",
    Engine: "neural",
  });

  const response = await polly.send(command);
  return await streamToBuffer(response.AudioStream);
};
