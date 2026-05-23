import puppeteer from "puppeteer";

export const scrapeWebsite = async (url) => {
  let browser;

  try {
    // Launching with --single-process and --disable-gpu 
    // is critical for low-memory environments like Render's free tier.
    browser = await puppeteer.launch({
      headless: "new",
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage", // Essential for Docker/container environments
        "--disable-gpu",
        "--no-zygote",
        "--single-process",        // Reduces memory overhead significantly
        "--disable-extensions",
        "--hide-scrollbars",
        "--mute-audio"
      ],
    });

    const page = await browser.newPage();

    // Set a realistic User-Agent to avoid being blocked
    await page.setUserAgent(
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
    );

    // Increase timeout slightly for slower free-tier instances
    await page.goto(url, {
      waitUntil: "domcontentloaded",
      timeout: 60000, 
    });

    // Extract data
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
      text: text.slice(0, 5000),
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
