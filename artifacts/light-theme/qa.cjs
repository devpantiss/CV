const fs = require('node:fs');
const path = require('node:path');
const { chromium } = require('/Users/apple/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
if (process.argv.includes('--interactions')) { require('./interactions.cjs'); return; }

const outputDir = __dirname;
const initial = process.argv.includes('--initial');
const routes = initial ? ['/'] : ['/', '/about', '/services', '/contact_us', '/events', '/colleges/ug', '/explorecity', '/courses/btech', '/auth/login'];
const viewports = initial ? [{ width: 390, height: 844 }] : [{ width: 1440, height: 900 }, { width: 390, height: 844 }];

(async () => {
  console.log('Launching isolated browser');
  const browser = await chromium.launch({ headless: true, timeout: 30000, executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome' });
  console.log('Browser launched');
  const results = fs.existsSync(path.join(outputDir, 'results.json')) ? JSON.parse(fs.readFileSync(path.join(outputDir, 'results.json'), 'utf8')) : [];
  for (const viewport of viewports) {
    const context = await browser.newContext({ viewport, reducedMotion: 'reduce' });
    for (const route of routes) {
      if (process.argv.includes('--resume') && results.some(result => result.route === route && result.viewport.width === viewport.width)) continue;
      const page = await context.newPage();
      const errors = [];
      page.on('pageerror', error => errors.push({ type: 'pageerror', message: error.message }));
      page.on('console', message => { if (message.type() === 'error') errors.push({ type: 'console', message: message.text() }); });
      console.log(`Checking ${route} at ${viewport.width}`);
      const response = await page.goto(`http://127.0.0.1:5173${route}`, { waitUntil: 'domcontentloaded', timeout: 20000 });
      await page.locator(route === '/courses/btech' ? '.btech-page-container h2' : 'h1:visible').first().waitFor({ state: 'visible', timeout: 15000 });
      await page.evaluate(() => Promise.race([document.fonts.ready, new Promise(resolve => setTimeout(resolve, 3000))]));
      const layout = await page.evaluate(() => {
        const viewportWidth = innerWidth;
        const overflow = [...document.querySelectorAll('body *')].map(element => ({ element, rect: element.getBoundingClientRect() })).filter(({element,rect}) => rect.width > 0 && (rect.right > viewportWidth + 2 || rect.left < -2) && getComputedStyle(element).position !== 'fixed').slice(0, 15).map(({element,rect}) => ({ tag: element.tagName, className: typeof element.className === 'string' ? element.className.slice(0, 140) : '', left: Math.round(rect.left), right: Math.round(rect.right) }));
        return { title: document.title, documentWidth: document.documentElement.scrollWidth, viewportWidth, h1: [...document.querySelectorAll('h1')].map(element => element.textContent.trim()), background: getComputedStyle(document.body).backgroundColor, overflow };
      });
      const slug = route === '/' ? 'home' : route.slice(1).replaceAll('/', '-');
      const screenshot = `${initial ? 'initial-' : ''}${slug}-${viewport.width}.png`;
      await page.screenshot({ path: path.join(outputDir, screenshot), fullPage: false, timeout: 10000, animations: 'disabled' }).catch(error => errors.push({ type: 'screenshot', message: error.message }));
      const previous = results.findIndex(result => result.route === route && result.viewport.width === viewport.width);
      if (previous !== -1) results.splice(previous, 1);
      results.push({ route, viewport, status: response.status(), ...layout, errors, screenshot });
      if (route === '/') {
        await page.getByRole('button', { name: 'Talk to our career advisors' }).click();
        const dialog = page.getByRole('dialog', { name: 'Book a consultation' });
        await dialog.waitFor({ state: 'visible' });
        const close = page.getByRole('button', { name: 'Close consultation' });
        const closeButtonVisible = await close.isVisible();
        await page.screenshot({ path: path.join(outputDir, `consultation-${viewport.width}.png`), fullPage: false, timeout: 10000, animations: 'disabled' });
        await page.keyboard.press('Escape');
        await dialog.waitFor({ state: 'hidden' });
        results[results.length - 1].consultation = { opens: true, closeButtonVisible, escapeCloses: true };
      }
      fs.writeFileSync(path.join(outputDir, initial ? 'initial-results.json' : 'results.json'), JSON.stringify(results, null, 2));
      await page.close();
    }
    await context.close();
  }
  await browser.close();
  fs.writeFileSync(path.join(outputDir, initial ? 'initial-results.json' : 'results.json'), JSON.stringify(results, null, 2));
  console.log(JSON.stringify(results.map(({ route, viewport, status, documentWidth, viewportWidth, errors }) => ({ route, width: viewport.width, status, overflow: documentWidth > viewportWidth, errorCount: errors.length })), null, 2));
})().catch(error => { console.error(error.message); process.exit(1); });
