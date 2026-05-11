import { analyzeWebsite } from "./analyze.service.js";

import { generateReview } from "../ai/gemini.service.js";

export const fullWebsiteAnalysis = async (url) => {
  // SCRAPE WEBSITE
  const websiteData = await analyzeWebsite(url);

  // AI REVIEW
  const aiReview = await generateReview(websiteData);

  return {
    websiteData,
    aiReview,
  };
};