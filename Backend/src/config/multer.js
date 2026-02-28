import multer from "multer";
import path from "path";
import crypto from "crypto";

const allowedTypes = [
  "application/pdf",
  "image/jpeg",
  "image/png",
];

const fileFilter = (req, file, cb) => {
  if (!allowedTypes.includes(file.mimetype)) {
    return cb(new Error("Invalid file type"), false);
  }
  cb(null, true);
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "storage/materials"); // change from uploads
  },
  filename: (req, file, cb) => {
    const uniqueName = crypto.randomUUID();
    cb(null, uniqueName + path.extname(file.originalname));
  },
});

export const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter,
});