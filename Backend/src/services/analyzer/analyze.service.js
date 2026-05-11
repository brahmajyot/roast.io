import { scrapeWebsite } from "../scraper/puppeteer.service.js";

export const analyzeWebsite = async (url) => {
  try {
    // SCRAPE WEBSITE
    const scrapedData = await scrapeWebsite(url);

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
    console.log(error);

    throw new Error("Website analysis failed");
  }
};