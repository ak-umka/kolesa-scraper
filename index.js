import cheerio from "cherio";
import chalk from "chalk";
import { slugify } from "transliteration";

import { arrayFromLength } from "./helpers/common.js";
import { getPageContent } from "./helpers/puppeteer.js";
import listItemsHandler from "./handlers/listItemsHandler.js";

const SITE = "https://kolesa.kz/cars/";
const pages = 2;

(async () => {
  try {
    for (const page of arrayFromLength(8)) {
      const url = page === 1 ? SITE : `${SITE}?page=${pages}`;

      const pageContent = await getPageContent(url);
      const $ = cheerio.load(pageContent);
      const carsItems = [];

      $('h5 > .a-card__link').each((i, header) => {
        const title = $(header).text().trim();
        const link = $(header).attr('href');
        carsItems.push(
          {
            title,
            link,
            code: slugify(title)
          }
        );
      });
      await listItemsHandler(carsItems);
    }
  } catch (error) {
    console.log(chalk.red(error));
  }
})();
