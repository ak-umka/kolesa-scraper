import cheerio from "cherio";
import chalk from "chalk";
import { slugify } from "transliteration";

import { getPageContent, getModalContent } from "../helpers/puppeteer.js";
import saveData from "./saveData.js";

const slugMap = {
  'alga': 'alha',
  'dongfeng': 'dong-feng',
  'jinbei': 'jin-bei',
  'renault-samsung': 'samsung',
  'ssangyong': 'ssang-yong',
  'retro-avtomobili': 'retro-automobiles',
};

const breakSlug = {
  'vaz-lada': 'vaz',
  'vis': 'vis',
  'gaz': 'gaz',
  'eraz': 'eraz',
  'zaz': 'zaz',
  'zil': 'zil',
  'izh': 'ij',
  'luaz': 'luaz',
  'moskvich': 'moskvich',
  'раф': 'raf',
  'smz': 'smz',
  'tagaz': 'tagaz',
  'uaz': 'uaz'
}

export async function carListModel(data) {
  try {
    // get only values from object with for loop 
    const allCars = {};
    for (const key in data) {
      const values = data[key];
      for (const value of values) {
        // const { slug } = value;

        let slug = value.slug;

        if (breakSlug[slug]) {
          break;
        }

        if (slugMap[slug]) {
          slug = slugMap[slug];
        }
        const carModel = {};

        const detailContent = await getModalContent('https://kolesa.kz/cars/' + slug);
        const $ = cheerio.load(detailContent);
        $('.filter-car__extended-group > dl').each((i, el) => {
          const title = $(el).find('dt').text();
          const items = $(el).find('.filter-button__label').map((i, el) => {
            const name = $(el).text().trim();
            const slug2 = slugify(name).trim();
            return { name, slug: slug2 };
          }).get();
          carModel[title] = items;
        });
        allCars[slug] = carModel;
      }
    }
    await saveData('CarList', allCars);
    return allCars;
  } catch (error) {
    console.log(chalk.red(error));
  }
}

const carModelMap = {
  "id.3": "id3",
  "id.4": "id4",
  "id.6": "id6",
  "passat-usa": "passat-usa",
  "passat-cc": "passat-cc",
  '2121-4x4': '2121',
  'lada-2121': '2121',
  'lada-2131-5-ti-dvernyy': '2131',
  'granta': 'lada-granta',
  'granta-2190': '2190',
  'granta-2191': '2191',
  'granta-2192': '2192',
  'granta-2194': '2194',
  'kalina': 'lada-kalina',
  'kalina-1117': '1117',
  'kalina-1118': '1118',
  'kalina-1119': '1119',
  'largus': 'lada-largus',
  'largus': 'lada-r90',
  'largus-furgon': 'lada-f90',
  'largus-cross': 'lada-c90',
  'niva-travel': 'lada-niva-travel',
  'priora': 'lada-priora',
  'priora-2170': '2170',
  'priora-2171': '2171',
  'priora-2172': '2172',
  'vesta-cross': 'vesta_cross',
  'xray-cross': 'xray_cross',
  '2345-zhiguli': '234500',
  '2347-lada-samara': '234700-lada-samara',
  '2349-lada-granta': '234900-lada-granta',
  '2330-tigr': '2330',
  '24-volga': '24',
  '3102-volga': '3102',
  '310221-volga': '310221',
  '31029-volga': '31029',
  '3110-volga': '3110',
  '31105-volga': '31105',
  '3111-volga': '3111',
  '67': '67b',
  'gazel': '3302-gazel',
  'gazel-next': 'a21r32-gazel-next',
  'm-20-pobeda': '20-pobeda',

}

export async function carListGeneration(data) {
  try {
    const carGenerations = {};
    for (const key in data) {
      const carBrand = key;
      const carModel = data[key];
      carGenerations[carBrand] = {}; // create object for current brand
      for (let subkey in carModel) {
        let carModelGeneration = {};
        carGenerations[carBrand][subkey] = []; // create array for current model
        for (const item of carModel[subkey]) {
          let slug = item.slug;

          if (slug === 'a') {
            continue;
          }

          if (carModelMap[slug]) {
            slug = carModelMap[slug];
          }

          const carGeneration = [];
          const detailContent = await getModalContent('https://kolesa.kz/cars/' + carBrand + '/' + slug);
          const $ = cheerio.load(detailContent);
          $('.generations__list > div').each((i, el) => {
            const title = $(el).find('span').text().trim();
            carGeneration.push(title);
          });
          carGenerations[carBrand][subkey].push({ ...item, generation: carGeneration });
        }
      }
    }
    await saveData('CarGeneration', carGenerations);
    console.log(JSON.stringify(carGenerations), 'carGenerations')
  }
  catch (error) {
    console.log(chalk.red(error));
  }
}
