import cheerio from "cherio";
import chalk from "chalk";
import { slugify } from "transliteration";

import { getPageContent, getModalContent } from "../helpers/puppeteer.js";
import { formatPrice } from "../helpers/common.js";
import saveData from "./saveData.js";

export default async function listItemsHandler(data) {
  try {
    for (const initialData of data) {
      console.log(chalk.green(`Getting data from: `) + chalk.green.bold(initialData.link));
      const detailContent = await getPageContent('https://kolesa.kz' + initialData.link);
      const $ = cheerio.load(detailContent);
      const priceNewStr = $('.offer__price').text();
      const priceNew = formatPrice(priceNewStr);

      const descriptionObject = {};
      $('.offer__parameters > dl').each((i, item) => {
        const key = $(item).find('dt').text();
        // const value = $(item).find('dd').text();
        // // descriptionObject[key] = value.trim();
        // descriptionObject = {
        //   city: value.trim(),
        //   generation: value.trim(),
        //   carBody : value.trim(),
        //   engineCapacity: value.trim(),
        //   transmission: value.trim(),
        //   driveUnit: value.trim(),
        //   steeringWheel: value.trim(),
        //   color: value.trim(),
        // }
        if (key.trim() === 'Город') {
          const city = $(item).find('dd').text();
          descriptionObject.city = city.trim();
        }
        if (key.trim() === 'Поколение') {
          const generation = $(item).find('dd').text();
          descriptionObject.generation = generation.trim();
        }
        if (key.trim() === 'Кузов') {
          const carBody = $(item).find('dd').text();
          descriptionObject.carBody = carBody.trim();
        }
        if (key.trim() === 'Объем двигателя, л') {
          const engineCapacity = $(item).find('dd').text();
          descriptionObject.engineCapacity = engineCapacity.trim();
        }
        if (key.trim() === 'Коробка передач') {
          const transmission = $(item).find('dd').text();
          descriptionObject.transmission = transmission.trim();
        }
        if (key.trim() === 'Привод') {
          const driveUnit = $(item).find('dd').text();
          descriptionObject.driveUnit = driveUnit.trim();
        }
        if (key.trim() === 'Руль') {
          const steeringWheel = $(item).find('dd').text();
          descriptionObject.steeringWheel = steeringWheel.trim();
        }
        if (key.trim() === 'Цвет') {
          const color = $(item).find('dd').text();
          descriptionObject.color = color.trim();
        }
        if (key.trim() === 'Растаможен в Казахстане') {
          const inKazakhstan = $(item).find('dd').text();
          descriptionObject.inKazakhstan = inKazakhstan.trim();
        }
      });

      await saveData({
        ...initialData,
        priceNew,
        description: descriptionObject,
      });
    }
  } catch (error) {
    console.log(chalk.red(error));
  }
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
        if (slug === 'alga') {
          slug = 'alha';
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
        console.log(carModel, 'carModel')
        allCars[slug] = carModel;
        console.log(JSON.stringify(allCars), 'allCars')
      }
    }
  } catch (error) {
    console.log(chalk.red(error));
  }
}
