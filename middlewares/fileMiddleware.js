import multer from "multer";

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  // Accept images, audio, video
  const allowedTypes = /jpeg|jpg|png|gif|mp3|wav|mp4|mov|avi|csv|xlsx/;
  const ext = file.originalname.split(".").pop().toLowerCase();

  if (allowedTypes.test(ext)) {
    cb(null, true);
  } else {
    cb(new Error("File type not allowed"), false);
  }
};

export const upload = multer({
  storage,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50 MB limit
  fileFilter,
});
