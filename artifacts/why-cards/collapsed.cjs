const fs = require('node:fs');
const path = require('node:path');
const { chromium } = require('/Users/apple/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
(async () => {
  const browser = await chromium.launch({ headless: true, timeout: 30000, executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome' });
  try {
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' });
    await page.goto('http://127.0.0.1:5173/', { waitUntil: 'domcontentloaded' });
    await page.waitForFunction(() => document.querySelectorAll('.why-card').length === 4 && !document.querySelector('.why-card[data-active="true"]'), { timeout: 10000 });
    const section = page.locator('#why-career-valley');
    await section.scrollIntoViewIfNeeded();
    const result = await section.evaluate(element => ({ activeCount: element.querySelectorAll('.why-card[data-active="true"]').length, expectedDefaultIndex: -1, heights: [...element.querySelectorAll('.why-card')].map(card => card.getBoundingClientRect().height), numberColors: [...element.querySelectorAll('.why-card-number')].map(number => getComputedStyle(number).color), documentOverflow: document.documentElement.scrollWidth > innerWidth }));
    result.equalHeights = new Set(result.heights).size === 1;
    result.numbersMatchLogoGreen = result.numberColors.every(color => color === 'rgb(40, 100, 88)');
    await section.screenshot({ path: path.join(__dirname, 'collapsed-default-1440.png'), animations: 'disabled', timeout: 10000, style: '.original-header, .skip-link { visibility: hidden !important; }' });
    await section.locator('.why-card').nth(1).hover();
    result.hoverActiveIndex = await section.locator('.why-card').evaluateAll(cards => cards.findIndex(card => card.dataset.active === 'true'));
    result.passed = result.activeCount === 0 && result.equalHeights && result.numbersMatchLogoGreen && result.hoverActiveIndex === 1 && !result.documentOverflow;
    fs.writeFileSync(path.join(__dirname, 'collapsed-followup.json'), JSON.stringify(result, null, 2));
    console.log(JSON.stringify(result));
  } finally { await browser.close(); }
})().catch(error => { console.error(error.message); process.exit(1); });
