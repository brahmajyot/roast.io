import { scrapeWebsite } from "../scraper/puppeteer.service.js";

export const analyzeWebsite = async (url) => {
  try {
    if (!url) {
      throw new Error("URL is required");
    }

    const normalizedUrl = /^https?:\/\//i.test(url)
      ? url
      : `https://${url}`;

    // SCRAPE WEBSITE
    const scrapedData = await scrapeWebsite(normalizedUrl);

    // TEMP MOCK SCORES
    const lighthouseData = {
      performance: 85,
      seo: 80,
      accessibility: 90,
      bestPractices: 88,
    };

    // RETURN COMBINED DATA
    return {
      ...scrapedData,
      ...lighthouseData,
    };
  } catch (error) {
    console.log("ANALYSIS ERROR:", error);

    throw new Error(
      `Website analysis failed: ${error.message}`
    );
  }
};
