/**
 * Prerender the built SPA so crawlers that don't execute JavaScript (Bing, most
 * social-card scrapers, etc.) see real content instead of an empty <div id="root">.
 *
 * How it works: serve dist/ statically, load it in headless Chrome, wait for React
 * to render, then dump the fully rendered DOM back into dist/index.html. The build
 * output (script/style tags) is untouched, so React still boots and takes over the
 * page normally for real visitors — this only changes what a non-JS crawler sees.
 */
import express from 'express';
import puppeteer from 'puppeteer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distDir = path.resolve(__dirname, '..', 'dist');
const indexFile = path.join(distDir, 'index.html');

async function main() {
  if (!fs.existsSync(indexFile)) {
    throw new Error(`Nothing to prerender: ${indexFile} not found. Run "npm run build" first.`);
  }

  const app = express();
  app.use(express.static(distDir));
  const server = await new Promise((resolve) => {
    const s = app.listen(0, () => resolve(s));
  });
  const port = server.address().port;
  const url = `http://127.0.0.1:${port}/`;

  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu', '--disable-dev-shm-usage'],
  });

  try {
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'networkidle0', timeout: 30000 });

    // Wait until React has actually mounted content into #root.
    await page.waitForFunction(
      () => {
        const root = document.getElementById('root');
        return !!root && root.children.length > 0 && root.innerText.trim().length > 100;
      },
      { timeout: 20000 },
    );

    const html = await page.content();
    fs.writeFileSync(indexFile, `<!doctype html>\n${html}`);

    const textLength = await page.evaluate(() => document.body.innerText.trim().length);
    console.log(`Prerendered ${indexFile} (${html.length} bytes HTML, ${textLength} chars visible text).`);
  } finally {
    await browser.close();
    server.close();
  }
}

main().catch((err) => {
  console.error('Prerender failed:', err);
  process.exit(1);
});
