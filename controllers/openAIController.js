// export const transcribeAudio = async (req, res) => {
//   try {
//     const form = new FormData();

//     form.append(
//       "file",
//       new Blob([req.file.buffer], { type: req.file.mimetype }),
//       req.file.originalname,
//     );

//     form.append("model", "gpt-4o-mini-transcribe");

//     const openaiRes = await fetch(
//       "https://api.openai.com/v1/audio/transcriptions",
//       {
//         method: "POST",
//         headers: {
//           Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
//         },
//         body: form,
//       },
//     );

//     const data = await openaiRes.json();
//     return res.status(openaiRes.status).json(data);
//   } catch (err) {
//     console.error(err);
//     return res.status(500).json({ error: "Transcription failed" });
//   }
// };
export const transcribeAudio = async (req, res) => {
  try {
    const form = new FormData();

    form.append(
      "file",
      new Blob([req.file.buffer], { type: req.file.mimetype }),
      req.file.originalname,
    );

    form.append("model", req.body.model || "gpt-4o-mini-transcribe");
    if (req.body.language) form.append("language", req.body.language);
    if (req.body.prompt) form.append("prompt", req.body.prompt);

    const openaiRes = await fetch(
      "https://api.openai.com/v1/audio/transcriptions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },
        body: form,
      },
    );

    const data = await openaiRes.json();
    return res.status(openaiRes.status).json(data);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Transcription failed" });
  }
};
