import cheerio from "cherio";
import chalk from "chalk";
import { slugify } from "transliteration";

import { getPageContent, getModalContent } from "./helpers/puppeteer.js";
import { carListModel, carListGeneration } from "./handlers/listItemsHandler.js";

const SITE = "https://kolesa.kz/cars/";
const pages = 2;

const testList =
{
  "acura": {
    "c": [
      { "name": "CL", "slug": "cl" },
      { "name": "CSX", "slug": "csx" }
    ],
    "e": [{ "name": "EL", "slug": "el" }],
    "i": [
      { "name": "ILX", "slug": "ilx" },
      { "name": "Integra", "slug": "integra" }
    ]
  },
  "aito": {
    "m": [
      { "name": "M5", "slug": "m5" },
      { "name": "M5 EV", "slug": "m5-ev" },
      { "name": "M7", "slug": "m7" }
    ]
  },
};

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
    const carList = await carListModel(car);
    await carListGeneration(carList);

    // const pageContent = await getModalContent(url + 'zaz');
    // const $ = cheerio.load(pageContent);
    // const car = {}
    // $('.filter-car__extended-group > dl').each((i, el) => {
    //   const title = $(el).find('dt').text();
    //   const items = $(el).find('.filter-button__label').map((i, el) => {
    //     const name = $(el).text().trim();
    //     const slug2 = slugify(name).trim();
    //     return { name, slug: slug2 };
    //   }).get();
    //   car[title] = items;
    // });
    // console.log(car);
    // }
  } catch (error) {
    console.log(chalk.red(error));
  }
})();
