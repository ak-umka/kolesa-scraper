import cheerio from "cherio";
import chalk from "chalk";

import { getPageContent } from "../helpers/puppeteer.js";
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


      console.log(descriptionObject, 'descriptionObject');

      await saveData({
        ...initialData,
        priceNew,
        description: descriptionObject,
      });


      // console.log(description, 'description');
      // console.log(priceNew, 'priceNew');
    }
  } catch (error) {
    console.log(chalk.red(error));
  }
}
