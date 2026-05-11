import puppeteer from "puppeteer";

export const scrapeWebsite = async (url) => {
  const browser = await puppeteer.launch({
    headless: true,
  });

  const page = await browser.newPage();

  // OPEN WEBSITE
  await page.goto(url, {
    waitUntil: "networkidle2",
    timeout: 60000,
  });

  // SCREENSHOT
  const screenshotPath = `screenshots/${Date.now()}.png`;

  await page.screenshot({
    path: screenshotPath,
    fullPage: true,
  });

  // EXTRACT DATA
  const data = await page.evaluate(() => {
    return {
      title: document.title,

      metaDescription:
        document
          .querySelector('meta[name="description"]')
          ?.getAttribute("content") || "",

      headings: Array.from(document.querySelectorAll("h1, h2, h3"))
        .map((el) => el.innerText)
        .filter(Boolean),

      links: Array.from(document.querySelectorAll("a"))
        .map((el) => el.href)
        .filter(Boolean),

      imagesWithoutAlt: Array.from(document.querySelectorAll("img"))
        .filter((img) => !img.alt)
        .length,

      textContent: document.body.innerText.slice(0, 3000),
    };
  });

  await browser.close();

  return {
    ...data,
    screenshot: screenshotPath,
  };
};