import path from 'path';
import fs from 'fs';
import chalk from 'chalk';

export default async function saveData(fileName, data) {
  const name = fileName;
  const filePath = path.join(process.cwd(), 'data', `${name}.json`);
  return new Promise((resolve, reject) => {
    fs.writeFile(filePath, JSON.stringify(data), (error) => {
      if (error) {
        console.log(chalk.red(error));
        reject(error);
      } else {
        console.log(chalk.green(`Data saved to: `) + chalk.green.bold(filePath));
        resolve();
      }
    });
  });
}