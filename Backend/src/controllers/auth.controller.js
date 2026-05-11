import User from "../models/user.model.js";

import jwt from "jsonwebtoken";

import otpGenerator from "otp-generator";

import { sendEmail } from "../services/mail/mail.service.js";

import {
  generateAccessToken,
  generateRefreshToken,
} from "../utils/generateToken.js";

// REGISTER USER
export const registerUser = async (
  req,
  res
) => {
  try {
    const { name, email, password } =
      req.body;

    const userExists = await User.findOne({
      email,
    });

    if (userExists) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    // GENERATE OTP
    const otp = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false,
    });

    // CREATE USER
    const user = await User.create({
      name,
      email,
      password,

      otp,

      otpExpire:
        Date.now() + 10 * 60 * 1000,
    });

    // SEND EMAIL
    await sendEmail(
      email,

      "Verify Your Account",

      `
      <div style="font-family:sans-serif;">
        <h2>Email Verification</h2>

        <h1>${otp}</h1>

        <p>
          OTP expires in 10 minutes.
        </p>
      </div>
      `
    );

    res.status(201).json({
      message:
        "User registered. OTP sent to email.",
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: error.message,
    });
  }
};

// VERIFY OTP
export const verifyOTP = async (
  req,
  res
) => {
  try {
    const { email, otp } = req.body;

    const user = await User.findOne({
      email,
    });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    if (user.otp !== otp) {
      return res.status(400).json({
        message: "Invalid OTP",
      });
    }

    if (user.otpExpire < Date.now()) {
      return res.status(400).json({
        message: "OTP expired",
      });
    }

    // VERIFY USER
    user.isVerified = true;

    user.otp = "";

    user.otpExpire = null;

    await user.save();

    // TOKENS
    const accessToken =
      generateAccessToken(user._id);

    const refreshToken =
      generateRefreshToken(user._id);

    user.refreshToken = refreshToken;

    await user.save();

    res.status(200).json({
      message:
        "Email verified successfully",

      accessToken,

      refreshToken,

      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: error.message,
    });
  }
};

// RESEND OTP
export const resendOTP = async (
  req,
  res
) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({
      email,
    });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    if (user.isVerified) {
      return res.status(400).json({
        message:
          "User already verified",
      });
    }

    // GENERATE OTP
    const otp = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false,
    });

    user.otp = otp;

    user.otpExpire =
      Date.now() + 10 * 60 * 1000;

    await user.save();

    // SEND EMAIL
    await sendEmail(
      email,

      "Resend OTP",

      `
      <div style="font-family:sans-serif;">
        <h2>New OTP Code</h2>

        <h1>${otp}</h1>
      </div>
      `
    );

    res.status(200).json({
      message:
        "New OTP sent successfully",
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: error.message,
    });
  }
};

// LOGIN USER
export const loginUser = async (
  req,
  res
) => {
  try {
    const { email, password } =
      req.body;

    const user = await User.findOne({
      email,
    });

    if (!user) {
      return res.status(400).json({
        message: "Invalid credentials",
      });
    }

    const isMatch =
      await user.comparePassword(
        password
      );

    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid credentials",
      });
    }

    if (!user.isVerified) {
      return res.status(400).json({
        message:
          "Please verify your email first",
      });
    }

    // TOKENS
    const accessToken =
      generateAccessToken(user._id);

    const refreshToken =
      generateRefreshToken(user._id);

    user.refreshToken = refreshToken;

    await user.save();

    res.status(200).json({
      message: "Login successful",

      accessToken,

      refreshToken,

      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        plan: user.plan,
      },
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: error.message,
    });
  }
};

// REFRESH ACCESS TOKEN
export const refreshAccessToken =
  async (req, res) => {
    try {
      const { refreshToken } = req.body;

      if (!refreshToken) {
        return res.status(401).json({
          message: "No refresh token",
        });
      }

      // VERIFY TOKEN
      const decoded = jwt.verify(
        refreshToken,
        process.env.JWT_REFRESH_SECRET
      );

      // FIND USER
      const user = await User.findById(
        decoded.id
      );

      if (!user) {
        return res.status(401).json({
          message:
            "Invalid refresh token",
        });
      }

      // CHECK TOKEN MATCH
      if (
        user.refreshToken !==
        refreshToken
      ) {
        return res.status(401).json({
          message: "Token mismatch",
        });
      }

      // NEW ACCESS TOKEN
      const accessToken =
        generateAccessToken(user._id);

      res.status(200).json({
        accessToken,
      });
    } catch (error) {
      console.log(error);

      res.status(401).json({
        message:
          "Invalid refresh token",
      });
    }
  };

// FORGOT PASSWORD
export const forgotPassword = async (
  req,
  res
) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({
      email,
    });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // RESET OTP
    const resetOtp =
      otpGenerator.generate(6, {
        upperCaseAlphabets: false,
        lowerCaseAlphabets: false,
        specialChars: false,
      });

    user.resetOtp = resetOtp;

    user.resetOtpExpire =
      Date.now() + 10 * 60 * 1000;

    await user.save();

    await sendEmail(
      email,

      "Reset Password",

      `
      <div style="font-family:sans-serif;">
        <h2>Password Reset OTP</h2>

        <h1>${resetOtp}</h1>
      </div>
      `
    );

    res.status(200).json({
      message:
        "Password reset OTP sent",
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: error.message,
    });
  }
};

// RESET PASSWORD
export const resetPassword = async (
  req,
  res
) => {
  try {
    const { email, otp, password } =
      req.body;

    const user = await User.findOne({
      email,
    });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    if (user.resetOtp !== otp) {
      return res.status(400).json({
        message: "Invalid OTP",
      });
    }

    if (
      user.resetOtpExpire <
      Date.now()
    ) {
      return res.status(400).json({
        message: "OTP expired",
      });
    }

    // UPDATE PASSWORD
    user.password = password;

    user.resetOtp = "";

    user.resetOtpExpire = null;

    await user.save();

    res.status(200).json({
      message:
        "Password reset successful",
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: error.message,
    });
  }
};

// GET CURRENT USER
export const getMe = async (
  req,
  res
) => {
  try {
    res.status(200).json(req.user);
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: error.message,
    });
  }
};


// LOGOUT
export const logoutUser = async (
  req,
  res
) => {
  try {
    res.status(200).json({
      message:
        "Logout successful",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};