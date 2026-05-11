import mongoose from "mongoose";

import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
    },

    password: {
      type: String,
      required: true,
    },

    plan: {
      type: String,
      default: "free",
    },

    credits: {
      type: Number,
      default: 3,
    },

    // EMAIL VERIFICATION
    isVerified: {
      type: Boolean,
      default: false,
    },

    // OTP
    otp: {
      type: String,
      default: "",
    },

    // OTP EXPIRY
    otpExpire: {
      type: Date,
    },

    resetOtp: {
  type: String,
  default: "",
},

resetOtpExpire: {
  type: Date,
},
refreshToken: {
  type: String,
  default: "",
},
  },
  {
    timestamps: true,
  }
);

// HASH PASSWORD BEFORE SAVE
userSchema.pre("save", async function () {
  // ONLY HASH IF PASSWORD MODIFIED
  if (!this.isModified("password")) {
    return;
  }

  // GENERATE SALT
  const salt = await bcrypt.genSalt(10);

  // HASH PASSWORD
  this.password = await bcrypt.hash(
    this.password,
    salt
  );
});

// COMPARE PASSWORD
userSchema.methods.comparePassword =
  async function (enteredPassword) {
    return await bcrypt.compare(
      enteredPassword,
      this.password
    );
  };

const User = mongoose.model(
  "User",
  userSchema
);

export default User;