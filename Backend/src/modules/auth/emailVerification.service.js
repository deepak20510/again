import crypto from "crypto";
import bcrypt from "bcrypt";
import client from "../../db.js";
import { AppError } from "../../utils/AppError.js";
import { sendVerificationOTPEmail } from "../../services/email.service.js";

const SALT_ROUNDS = Number(process.env.BCRYPT_ROUNDS) || 4; // Reduced from 10 to 4 for faster hashing
const OTP_EXPIRY_MINUTES = 10;

/**
 * Generate 6-digit OTP
 */
const generateOTP = () => {
  return crypto.randomInt(100000, 999999).toString();
};

/**
 * Hash OTP for secure storage
 */
const hashOTP = async (otp) => {
  return await bcrypt.hash(otp, SALT_ROUNDS);
};

/**
 * Verify OTP against hash
 */
const verifyOTP = async (otp, hashedOTP) => {
  if (!hashedOTP) return false;
  return await bcrypt.compare(otp, hashedOTP);
};

/**
 * Send verification OTP to user email
 */
export const sendVerificationOTP = async (email) => {
  const normalizedEmail = email.toLowerCase().trim();

  // Find user with minimal fields for speed
  const user = await client.user.findUnique({
    where: { email: normalizedEmail },
    select: { id: true, email: true, isVerified: true }
  });

  if (!user) {
    throw new AppError("User not found", 404);
  }

  if (user.isVerified) {
    throw new AppError("Email already verified", 400);
  }

  // Generate OTP
  const otp = generateOTP();
  
  // Parallel execution: Hash OTP and calculate expiry time
  const expiryTime = new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000);
  const hashedOTP = await hashOTP(otp);

  // Update database and send email in parallel
  await Promise.all([
    client.user.update({
      where: { email: normalizedEmail },
      data: {
        resetPasswordOTP: hashedOTP,
        resetPasswordOTPExpires: expiryTime,
      },
    }),
    // Send email without blocking
    sendVerificationOTPEmail(normalizedEmail, otp).catch(err => {
      console.error('[EmailVerification] Email send failed:', err.message);
    })
  ]);

  return {
    success: true,
    message: "Verification OTP sent to your email",
  };
};

/**
 * Verify email with OTP
 */
export const verifyEmailOTP = async (email, otp) => {
  const normalizedEmail = email.toLowerCase().trim();

  // Fetch only needed fields for speed
  const user = await client.user.findUnique({
    where: { email: normalizedEmail },
    select: {
      id: true,
      email: true,
      isVerified: true,
      resetPasswordOTP: true,
      resetPasswordOTPExpires: true
    }
  });

  if (!user) {
    throw new AppError("User not found", 404);
  }

  if (user.isVerified) {
    throw new AppError("Email already verified", 400);
  }

  if (!user.resetPasswordOTP || !user.resetPasswordOTPExpires) {
    throw new AppError("No verification OTP found. Please request a new one.", 400);
  }

  // Check if OTP expired (fast check before expensive bcrypt)
  if (new Date() > user.resetPasswordOTPExpires) {
    throw new AppError("OTP has expired. Please request a new one.", 400);
  }

  // Verify OTP
  const isValidOTP = await verifyOTP(otp, user.resetPasswordOTP);
  if (!isValidOTP) {
    throw new AppError("Invalid OTP", 400);
  }

  // Mark user as verified and clear OTP fields
  await client.user.update({
    where: { email: normalizedEmail },
    data: {
      isVerified: true,
      resetPasswordOTP: null,
      resetPasswordOTPExpires: null,
    },
  });

  return {
    success: true,
    message: "Email verified successfully",
  };
};

/**
 * Resend verification OTP
 */
export const resendVerificationOTP = async (email) => {
  return await sendVerificationOTP(email);
};
