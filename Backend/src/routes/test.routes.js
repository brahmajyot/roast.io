import express from "express";
import protect from "../middleware/auth.middleware.js";

import { fullWebsiteAnalysis } from "../services/analyzer/fullAnalyze.service.js";
import {
  analyzeLimiter,
} from "../middleware/rateLimit.middleware.js";

const router = express.Router();

router.post("/scrape",
  protect,
  analyzeLimiter, async (req, res) => {
  try {
    const { url } = req.body;

    // FULL ANALYSIS + AI
    const data = await fullWebsiteAnalysis(url);

    res.status(200).json(data);
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: error.message,
    });
  }
});

export default router;