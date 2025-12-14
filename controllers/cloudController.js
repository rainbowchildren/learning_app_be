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
