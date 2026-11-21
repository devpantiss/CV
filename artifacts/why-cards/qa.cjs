const fs = require('node:fs');
const path = require('node:path');
const { chromium } = require('/Users/apple/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
if (process.argv.includes('--collapsed')) { require('./collapsed.cjs'); return; }
const before = process.argv.includes('--before');
const compact = process.argv.includes('--compact');
const captures = process.argv.includes('--captures');
const results = [];
const save = () => fs.writeFileSync(path.join(__dirname, before ? 'before.json' : compact ? 'compact.json' : captures ? 'captures.json' : 'results.json'), JSON.stringify(results, null, 2));

(async () => {
  const browser = await chromium.launch({ headless: true, timeout: 30000, executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome' });
  try {
    for (const viewport of (compact ? [{ width: 1024, height: 900 }] : [{ width: 1440, height: 900 }, { width: 390, height: 844 }])) {
      const context = await browser.newContext({ viewport, reducedMotion: 'reduce', hasTouch: viewport.width < 600, isMobile: viewport.width < 600 });
      const page = await context.newPage();
      page.setDefaultTimeout(10000);
      const errors = [];
      page.on('pageerror', error => errors.push(error.message));
      await page.goto('http://127.0.0.1:5173/', { waitUntil: 'domcontentloaded', timeout: 20000 });
      const section = page.locator('#why-career-valley');
      await section.waitFor({ state: 'visible' });
      await section.scrollIntoViewIfNeeded();
      await page.evaluate(() => Promise.race([document.fonts.ready, new Promise(resolve => setTimeout(resolve, 2000))]));
      await section.screenshot({ path: path.join(__dirname, `${before ? 'before' : 'after'}-${viewport.width}.png`), animations: 'disabled', timeout: 10000, style: '.original-header, .skip-link { visibility: hidden !important; }' });
      const result = { viewport, errors, layout: await section.evaluate(element => ({ viewport: innerWidth, documentWidth: document.documentElement.scrollWidth, sectionWidth: element.getBoundingClientRect().width, heading: element.querySelector('h2')?.textContent })) };
      results.push(result);
      save();
      if (before || captures) { await context.close(); continue; }
      const cards = section.locator('.why-card');
      const triggers = section.locator('.why-card-trigger');
      const activeIndex = () => cards.evaluateAll(elements => elements.findIndex(element => element.dataset.active === 'true'));
      result.cardCount = await cards.count();
      result.defaultActiveIndex = await activeIndex();
      result.controls = await triggers.evaluateAll(elements => elements.map(element => ({ name: element.getAttribute('aria-label') || element.textContent.trim(), expanded: element.getAttribute('aria-expanded'), controls: element.getAttribute('aria-controls'), targetExists: Boolean(document.getElementById(element.getAttribute('aria-controls'))) })));
      if (viewport.width > 600) {
        await cards.nth(0).hover();
        result.hoverActiveIndex = await activeIndex();
        await triggers.nth(0).focus();
        let tabs = 0;
        while (tabs < 8 && !(await triggers.nth(1).evaluate(element => element === document.activeElement))) { await page.keyboard.press('Tab'); tabs += 1; }
        result.keyboard = { tabs, secondControlFocused: await triggers.nth(1).evaluate(element => element === document.activeElement), activeIndex: await activeIndex(), outline: await triggers.nth(1).evaluate(element => getComputedStyle(element).outline) };
      } else {
        await triggers.nth(0).tap();
        result.tapActiveIndex = await activeIndex();
      }
      await triggers.nth(1).click();
      await cards.nth(1).getByText('Book a consultation', { exact: true }).click();
      const dialog = page.getByRole('dialog', { name: 'Book a consultation' });
      await dialog.waitFor({ state: 'visible' });
      result.consultation = { opened: true };
      await page.keyboard.press('Escape');
      await dialog.waitFor({ state: 'hidden' });
      result.consultation.escapeCloses = true;
      result.links = [];
      for (let index = 0; index < result.cardCount; index += 1) {
        await triggers.nth(index).click();
        result.links.push({ index, activeIndex: await activeIndex(), content: await cards.nth(index).evaluate(element => { const body = element.querySelector('.why-card-body').getBoundingClientRect(); const card = element.getBoundingClientRect(); const title = element.querySelector('.why-card-title'); return { bodyInsideCard: body.top >= card.top && body.bottom <= card.bottom, titleFits: title.scrollWidth <= title.clientWidth + 1, detailsExposed: element.querySelector('.why-card-details').getAttribute('aria-hidden') === 'false' }; }), targets: await cards.nth(index).locator('a').evaluateAll(elements => elements.map(element => ({ text: element.textContent.trim(), href: element.getAttribute('href'), visible: Boolean(element.getBoundingClientRect().height) }))) });
      }
      await triggers.nth(2).click();
      await cards.nth(2).getByRole('link', { name: 'UG options', exact: true }).click();
      await page.waitForURL('**/colleges/ug');
      result.ugNavigation = new URL(page.url()).pathname;
      save();
      await context.close();
    }
  } finally { await browser.close(); }
  save();
  console.log(JSON.stringify(results, null, 2));
})().catch(error => { results.push({ error: error.message }); save(); console.error(error.message); process.exit(1); });
