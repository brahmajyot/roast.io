import express from "express";

import {
  registerUser,
  loginUser,
  getMe,
  verifyOTP,
  resendOTP,
  forgotPassword,
    logoutUser,

resetPassword
} from "../controllers/auth.controller.js";

import {
  authLimiter,
} from "../middleware/rateLimit.middleware.js";

import protect from "../middleware/auth.middleware.js";

const router = express.Router();

// REGISTER
router.post("/register",
  authLimiter,
   registerUser);

// VERIFY OTP
router.post("/verify-otp",
  authLimiter,
   verifyOTP);


router.post("/resend-otp",
  authLimiter,
   resendOTP);


// LOGIN
router.post("/login",
  authLimiter,
   loginUser);


   router.post(
  "/logout",
  logoutUser
);

router.post(
  "/forgot-password",
  authLimiter,
  forgotPassword
);

router.post(
  "/reset-password",
  authLimiter,
  resetPassword
);




// GET CURRENT USER
router.get("/me", protect, getMe);

export default router;