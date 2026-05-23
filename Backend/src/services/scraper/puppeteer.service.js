import puppeteer from "puppeteer";

export const scrapeWebsite = async (url) => {
  let browser;

  try {
    // Launching without hard-coded paths allows the buildpack 
    // to provide the correct system-installed binary.
    browser = await puppeteer.launch({
      headless: true,
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage",
        "--disable-gpu",
        "--no-zygote",
        "--single-process",
      ],
    });

    const page = await browser.newPage();

    // Set a user agent to avoid being blocked by some sites
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');

    await page.goto(url, {
      waitUntil: "domcontentloaded",
      timeout: 60000,
    });

    const title = await page.title();
    const description = await page.$eval('meta[name="description"]', (el) => el.content).catch(() => "");
    
    const headings = await page.$$eval("h1, h2, h3", (elements) =>
      elements.map((el) => el.innerText.trim()).filter(Boolean)
    );

    const links = await page.$$eval("a[href]", (anchors) =>
      anchors.map((anchor) => anchor.href).filter(Boolean)
    );

    const text = await page.evaluate(() => document.body.innerText);
    const images = await page.$$eval("img", (imgs) => imgs.map((img) => img.src));
    const imagesWithoutAlt = await page.$$eval("img", (imgs) => 
      imgs.filter((img) => !img.alt || !img.alt.trim()).length
    );

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
    console.log("SCRAPER ERROR:", error);
    throw new Error(`Scraping failed: ${error.message}`);
  } finally {
    if (browser) {
      await browser.close();
    }
  }
};
