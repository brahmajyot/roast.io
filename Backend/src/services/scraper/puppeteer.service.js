import puppeteer from "puppeteer";

export const scrapeWebsite =
  async (url) => {
    let browser;

    try {
      browser = await puppeteer.launch({
          headless: true,

          args: [
            "--no-sandbox",
            "--disable-setuid-sandbox",
            "--disable-dev-shm-usage",
            "--disable-gpu",
            "--single-process",
          ],
        });

      const page =
        await browser.newPage();

      await page.goto(url, {
        waitUntil:
          "domcontentloaded",

        timeout: 60000,
      });

      // GET TITLE
      const title =
        await page.title();

      // GET DESCRIPTION
      const description =
        await page.$eval(
          'meta[name="description"]',

          (el) =>
            el.content
        ).catch(() => "");

      const headings =
        await page.$$eval(
          "h1, h2, h3",

          (elements) =>
            elements
              .map((el) =>
                el.innerText.trim()
              )
              .filter(Boolean)
        );

      const links =
        await page.$$eval(
          "a[href]",

          (anchors) =>
            anchors
              .map((anchor) => anchor.href)
              .filter(Boolean)
        );

      // GET ALL TEXT
      const text =
        await page.evaluate(() => {
          return document.body.innerText;
        });

      // GET IMAGES
      const images =
        await page.$$eval(
          "img",

          (imgs) =>
            imgs.map(
              (img) => img.src
            )
        );

      const imagesWithoutAlt =
        await page.$$eval(
          "img",

          (imgs) =>
            imgs.filter(
              (img) =>
                !img.alt ||
                !img.alt.trim()
            ).length
        );

      await browser.close();
      browser = null;

      return {
        title,
        description,
        metaDescription: description,
        headings,
        links,
        text:
          text.slice(0, 5000),
        textContent:
          text.slice(0, 5000),
        images,
        imagesWithoutAlt,
      };
    } catch (error) {
      console.log(
        "SCRAPER ERROR:",
        error
      );

      throw new Error(
        `Scraping failed: ${error.message}`
      );
    } finally {
      if (browser) {
        await browser.close().catch(() => {});
      }
    }
  };
