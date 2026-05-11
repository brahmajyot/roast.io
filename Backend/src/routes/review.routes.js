import express from "express";

import protect from "../middleware/auth.middleware.js";

import {
  createReview,
  getReview,
  getReviewHistory,
} from "../controllers/review.controller.js";

const router = express.Router();

// CREATE REVIEW
router.post("/", protect, createReview);

// REVIEW HISTORY
router.get("/history", protect, getReviewHistory);

// GET SINGLE REVIEW
router.get("/:id", protect, getReview);

export default router;