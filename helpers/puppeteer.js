import puppeteer from "puppeteer";

export const LAUNCH_PUPPETEER_OPTIONS = {
  args: [
    '--no-sandbox',
    '--disable-setuid-sandbox',
    '--disable-dev-shm-usage',
    '--disable-accelerated-2d-canvas',
    '--disable-gpu',
    '--window-size=1920,1080',
    '--enable-features=NetworkService,NetworkServiceInProcess',
  ]
};

export const PAGE_PUPPETEER_OPTIONS = {
  networkIdle2Timeout: 5000,
  waitUntil: 'networkidle2',
  timeout: 3000000,
};

export async function getPageContent(url) {
  try {
    const browser = await puppeteer.launch(LAUNCH_PUPPETEER_OPTIONS);
    const page = await browser.newPage();
    await page.goto(url, PAGE_PUPPETEER_OPTIONS);
    await page.click('.filter-button');
    const content = await page.content();
    await browser.close();
    return content;
  } catch (error) {
    throw error
  }
}  