import puppeteer from "puppeteer";

export const scrapeWebsite = async (url) => {
  let browser;

  try {
    // 1. The executablePath uses the buildpack's path.
    // 2. The args are optimized to prevent memory crashes on the Free Tier.
    browser = await puppeteer.launch({
      executablePath: process.env.GOOGLE_CHROME_BIN || '/usr/bin/google-chrome',
      headless: "new",
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage",
        "--disable-gpu",
        "--no-zygote",
        "--single-process", // Highly recommended for memory-constrained environments
        "--disable-extensions",
        "--disable-background-networking",
        "--disable-default-apps",
        "--disable-sync"
      ],
    });

    const page = await browser.newPage();

    // Set a standard User-Agent to avoid immediate blocks
    await page.setUserAgent(
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
    );

    // Navigate to the URL
    await page.goto(url, {
      waitUntil: "domcontentloaded",
      timeout: 45000, // Reduced slightly to avoid long hangs on Free Tier
    });

    // Use Promise.all to fetch data in parallel for speed
    const [title, description, headings, links, text, images, imagesWithoutAlt] = await Promise.all([
      page.title(),
      page.$eval('meta[name="description"]', (el) => el.content).catch(() => ""),
      page.$$eval("h1, h2, h3", (els) => els.map((el) => el.innerText.trim()).filter(Boolean)),
      page.$$eval("a[href]", (anchors) => anchors.map((a) => a.href).filter(Boolean)),
      page.evaluate(() => document.body.innerText),
      page.$$eval("img", (imgs) => imgs.map((img) => img.src)),
      page.$$eval("img", (imgs) => imgs.filter((img) => !img.alt || !img.alt.trim()).length)
    ]);

    return {
      title,
      description,
      metaDescription: description,
      headings,
      links,
      text: text.slice(0, 5000), // Slice to save memory
      textContent: text.slice(0, 5000),
      images,
      imagesWithoutAlt,
    };

  } catch (error) {
    console.error("SCRAPER ERROR:", error);
    throw new Error(`Scraping failed: ${error.message}`);
  } finally {
    if (browser) {
      await browser.close();
    }
  }
};
