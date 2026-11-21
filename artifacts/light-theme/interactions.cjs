const fs = require('node:fs');
const path = require('node:path');
const { chromium } = require('/Users/apple/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const footerOnly = process.argv.includes('--footer');
const output = footerOnly ? JSON.parse(fs.readFileSync(path.join(__dirname, 'interactions.json'), 'utf8')) : {};
const save = () => fs.writeFileSync(path.join(__dirname, 'interactions.json'), JSON.stringify(output, null, 2));
(async () => {
  const browser = await chromium.launch({ headless: true, timeout: 30000, executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome' });
  try {
    if (!footerOnly) {
    const context = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: 'no-preference' });
    const page = await context.newPage();
    page.setDefaultTimeout(10000);
    await page.goto('http://127.0.0.1:5173', { waitUntil: 'domcontentloaded' });
    await page.locator('h1').first().waitFor({ state: 'visible' });
    await page.keyboard.press('Tab');
    output.keyboardFocus = await page.evaluate(() => ({ tag: document.activeElement.tagName, text: document.activeElement.textContent.trim(), outline: getComputedStyle(document.activeElement).outline, visible: document.activeElement.getBoundingClientRect().height > 0 }));
    const courses = page.getByRole('button', { name: 'Courses', exact: true });
    await courses.click();
    await page.keyboard.press('Escape');
    output.desktopMenuEscape = await courses.getAttribute('aria-expanded') === 'false';
    await page.locator('.pdg-tunnel-wrap').evaluate(element => window.scrollTo({ top: element.getBoundingClientRect().top + window.scrollY + 400, behavior: 'instant' }));
    await page.waitForTimeout(800);
    await page.screenshot({ path: path.join(__dirname, 'pathways-motion-1440.png'), timeout: 10000 });
    output.normalMotionPathway = { captured: true, background: await page.locator('.pdg-tunnel-wrap').evaluate(element => getComputedStyle(element).backgroundColor) };
    const explorer = page.locator('#career-explorer');
    await explorer.getByRole('button', { name: 'Business', exact: true }).click();
    output.explorer = { businessSelected: await explorer.getByRole('button', { name: 'Business', exact: true }).getAttribute('aria-pressed'), courseLinks: await explorer.locator('a[href^="/courses/"]').evaluateAll(elements => elements.map(element => element.getAttribute('href'))) };
    await page.screenshot({ path: path.join(__dirname, 'explorer-1440.png'), timeout: 10000 });
    await context.close();
    save();
    const mobile = await browser.newContext({ viewport: { width: 390, height: 844 }, reducedMotion: 'reduce' });
    const mobilePage = await mobile.newPage();
    mobilePage.setDefaultTimeout(10000);
    await mobilePage.goto('http://127.0.0.1:5173', { waitUntil: 'domcontentloaded' });
    await mobilePage.locator('h1').first().waitFor({ state: 'visible' });
    await mobilePage.getByRole('button', { name: 'Open menu', exact: true }).click();
    await mobilePage.getByRole('navigation', { name: 'Mobile navigation' }).waitFor({ state: 'visible' });
    await mobilePage.keyboard.press('Escape');
    output.mobileMenuEscape = await mobilePage.getByRole('button', { name: 'Open menu', exact: true }).isVisible();
    output.mobileFocusRestored = await mobilePage.getByRole('button', { name: 'Open menu', exact: true }).evaluate(element => element === document.activeElement);
    await mobile.close();
    save();
    }
    output.eventStates ||= {};
    for (const state of (footerOnly ? ['error'] : ['loading', 'empty', 'error'])) {
      const eventContext = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' });
      const eventPage = await eventContext.newPage();
      eventPage.setDefaultTimeout(10000);
      let release;
      await eventPage.route('**/api/events/Upcoming', async route => {
        if (state === 'loading') await new Promise(resolve => { release = resolve; });
        await route.fulfill({ status: state === 'error' ? 500 : 200, contentType: 'application/json', body: JSON.stringify(state === 'error' ? { message: 'Local QA error state' } : { events: [] }) }).catch(() => {});
      });
      await eventPage.goto('http://127.0.0.1:5173/events', { waitUntil: 'domcontentloaded' });
      const target = state === 'loading' ? eventPage.getByLabel('Loading events') : state === 'empty' ? eventPage.getByText('No upcoming events right now.') : eventPage.getByText('We couldn’t load events.');
      await target.waitFor({ state: 'visible' });
      await target.scrollIntoViewIfNeeded();
      output.footer = await eventPage.locator('footer').evaluate(element => ({ background: getComputedStyle(element).backgroundColor, color: getComputedStyle(element).color }));
      await eventPage.screenshot({ path: path.join(__dirname, `events-${state}-1440.png`), timeout: 10000, animations: 'disabled' });
      output.eventStates[state] = { visible: true, source: 'locally mocked API response' };
      if (release) release();
      await eventContext.close();
      save();
    }
  } finally { await browser.close(); }
  save();
  console.log(JSON.stringify(output, null, 2));
})().catch(error => { output.error = error.message; save(); console.error(error.message); process.exit(1); });
