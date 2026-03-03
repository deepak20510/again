import express from "express";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import multer from "multer";
import { authMiddleware } from "../../middleware/auth.middleware.js";
import cloudinary from "../../config/cloudinary.js";

const router = express.Router();

// Configure Cloudinary storage for simple uploads
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "uploads",
    allowed_formats: ["jpg", "jpeg", "png", "pdf", "webp"],
    resource_type: "auto",
    transformation: [{ quality: "auto" }],
  },
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      "application/pdf",
      "image/jpeg",
      "image/png",
      "image/jpg",
      "image/webp",
    ];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Only images and PDFs are allowed"), false);
    }
  },
});

// Simple upload endpoint - trainers and institutions only
router.post(
  "/upload",
  authMiddleware(["TRAINER", "INSTITUTION"]),
  upload.single("file"),
  (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: "No file uploaded",
        });
      }

      // Use Cloudinary secure URL
      const fileUrl = req.file.path || req.file.secure_url;

      res.status(200).json({
        success: true,
        message: "File uploaded successfully",
        data: {
          filename: req.file.filename,
          originalName: req.file.originalname,
          size: req.file.size,
          mimetype: req.file.mimetype,
          url: fileUrl, // Cloudinary URL
        },
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message || "Failed to upload file",
      });
    }
  },
);

export default router;
