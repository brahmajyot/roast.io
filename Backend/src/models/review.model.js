import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    url: {
      type: String,
      required: true,
    },

    type: {
      type: String,
      enum: ["portfolio", "website"],
      default: "portfolio",
    },

    roastMode: {
      type: Boolean,
      default: false,
    },

    tone: {
      type: String,
      enum: ["professional", "roast", "recruiter", "faang"],
      default: "professional",
    },

    status: {
      type: String,
      enum: ["pending", "processing", "completed", "failed"],
      default: "pending",
    },

    score: {
      type: Number,
      default: 0,
    },

    seoScore: {
      type: Number,
      default: 0,
    },

    performanceScore: {
      type: Number,
      default: 0,
    },

    accessibilityScore: {
      type: Number,
      default: 0,
    },

    hiringScore: {
      type: Number,
      default: 0,
    },

    strengths: {
      type: [String],
      default: [],
    },

    weaknesses: {
      type: [String],
      default: [],
    },

    improvements: {
      type: [String],
      default: [],
    },

    reviewData: {
      type: Object,
      default: {},
    },

    screenshot: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

const Review = mongoose.model("Review", reviewSchema);

export default Review;