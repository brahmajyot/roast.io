import express from "express";

import {
  createFeedback,
  getFeedbacks,
} from "../controllers/feedback.controller.js";

const router = express.Router();

// CREATE FEEDBACK
router.post(
  "/",
  createFeedback
);

// GET FEEDBACKS
router.get(
  "/",
  getFeedbacks
);

export default router;