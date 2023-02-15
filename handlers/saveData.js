import path from 'path';
import fs from 'fs';
import chalk from 'chalk';

export default async function saveData(data) {
  const { code } = data;
  const filePath = path.join(process.cwd(), 'data', `${code}.json`);
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