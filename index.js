import cheerio from "cherio";
import chalk from "chalk";
import { slugify } from "transliteration";

import { arrayFromLength } from "./helpers/common.js";
import { getPageContent } from "./helpers/puppeteer.js";
import { carListModel } from "./handlers/listItemsHandler.js";

const SITE = "https://kolesa.kz/cars/";
const pages = 2;

(async () => {
  try {
    // for (const page of arrayFromLength(8)) {
    // const url = page === 1 ? SITE : `${SITE}?page=${pages}`;
    const url = `${SITE}`

    const pageContent = await getPageContent(url);
    const $ = cheerio.load(pageContent);
    const car = {}
    $('.filter-car__extended-group > dl').each((i, el) => {
      const title = $(el).find('dt').text().toUpperCase().trim();
      const items = $(el).find('.filter-button__label').map((i, el) => {
        const name = $(el).text().trim();
        const slug = slugify(name).trim();
        return { name, slug };
      }).get();
      car[title] = items;
    });

    // get slug from car object 
    // const values = Object.values(car);
    // values.map((item) => item.map(async (i) => await carListModel(i.slug)));
    await carListModel(car);
    // }
  } catch (error) {
    console.log(chalk.red(error));
  }
})();
