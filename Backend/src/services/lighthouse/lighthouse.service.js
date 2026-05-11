import lighthouse from "lighthouse";
import * as chromeLauncher from "chrome-launcher";

export const runLighthouse = async (url) => {
  // LAUNCH CHROME
  const chrome = await chromeLauncher.launch({
    chromeFlags: ["--headless"],
  });

  // RUN LIGHTHOUSE
  const result = await lighthouse(url, {
    port: chrome.port,

    logLevel: "info",
  });

  const report = result.lhr;

  // CLOSE CHROME
  await chrome.kill();

  // RETURN SCORES
  return {
    performance:
      report.categories.performance.score * 100,

    seo:
      report.categories.seo.score * 100,

    accessibility:
      report.categories.accessibility.score * 100,

    bestPractices:
      report.categories["best-practices"].score * 100,
  };
};