import express from "express";
import rateLimit from "express-rate-limit";
import { validate } from "../../middleware/validate.middleware.js";
import { loginSchema, signupSchema, forgotPasswordSchema, verifyOTPSchema, resetPasswordSchema } from "./auth.schema.js";
import { login, signup } from "./auth.controller.simple.js";
import { forgotPassword, verifyResetOTP, resetPassword } from "./passwordReset.controller.js";

const router = express.Router();

// Rate limiter for forgot password (prevent abuse)
const forgotPasswordLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 3, // 3 attempts per 15 minutes
  message: {
    success: false,
    message: "Too many password reset attempts. Please try again later.",
  },
});

// Existing routes
router.post("/signup", signup);
router.post("/login", login);

// Password reset routes
router.post("/forgot-password", forgotPasswordLimiter, validate(forgotPasswordSchema), forgotPassword);
router.post("/verify-reset-otp", validate(verifyOTPSchema), verifyResetOTP);
router.post("/reset-password", validate(resetPasswordSchema), resetPassword);

export default router;
