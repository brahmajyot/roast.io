import puppeteer from "puppeteer";

export const scrapeWebsite =
  async (url) => {
    try {
      const browser =
        await puppeteer.launch({
          headless: true,

          args: [
            "--no-sandbox",
            "--disable-setuid-sandbox",
          ],
        });

      const page =
        await browser.newPage();

      await page.goto(url, {
        waitUntil:
          "networkidle2",

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

      await browser.close();

      return {
        title,
        description,
        text:
          text.slice(0, 5000),
        images,
      };
    } catch (error) {
      console.log(
        "SCRAPER ERROR:",
        error
      );

      throw new Error(
        "Scraping failed"
      );
    }
  };