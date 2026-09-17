import { chromium } from '/Users/user/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs';
import { mkdir, writeFile } from 'node:fs/promises';
import assert from 'node:assert/strict';
await mkdir('.artifacts/screenshots', { recursive: true });
const browser = await chromium.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: true });
const page = await browser.newPage();
if (process.argv.includes('--export-assets')) {
  await mkdir('dist/assets/layouts', { recursive: true });
  for (const name of ['primary','primary-ink','primary-reversed','horizontal','horizontal-ink','horizontal-reversed','symbol','symbol-ink','symbol-reversed']) {
    const dimensions = name.startsWith('primary') ? [1120,816] : name.startsWith('horizontal') ? [1120,236] : [512,512];
    await page.setViewportSize({width:dimensions[0],height:dimensions[1]});
    await page.goto(`http://127.0.0.1:4173/assets/logos/${name}.svg`);
    await page.screenshot({path:`dist/assets/logos/${name}.png`,omitBackground:true});
  }
  for (const [name,route,width,height] of [
    ['mobile-opening','/',390,1000],['mobile-signup','/#waitlist',390,1100],
    ['desktop-opening','/',1440,960],['mobile-brand','/brand.html',390,1000]
  ]) {
    await page.setViewportSize({width,height});
    await page.goto(`http://127.0.0.1:4173${route}`,{waitUntil:'networkidle'});
    await page.evaluate(()=>document.fonts.ready);
    if (route.includes('#')) {
      await page.locator('#waitlist').evaluate(element=>element.scrollIntoView({behavior:'instant',block:'start'}));
      assert.ok(Math.abs((await page.locator('#waitlist').boundingBox()).y)<80,'Direct signup link positioning');
    }
    await page.waitForTimeout(300);
    await page.screenshot({path:`dist/assets/layouts/${name}.png`});
  }
  await browser.close();
  console.log('Exported 9 transparent logo PNGs and 4 desktop/mobile layout previews.');
  process.exit(0);
}
const errors = [], failed = [], external = [];
page.on('pageerror', error => errors.push(error.message));
page.on('response', response => { if (response.status() >= 400) failed.push(response.url()); });
page.on('request', request => { if (!request.url().startsWith('http://127.0.0.1:4173/') && !request.url().startsWith('data:')) external.push(request.url()); });
const findings = [];
for (const route of ['/', '/brand.html', '/privacy.html']) {
  for (const width of [320, 360, 390, 768, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto(`http://127.0.0.1:4173${route}`, { waitUntil: 'networkidle' });
    await page.evaluate(() => document.fonts.ready);
    const overflow = await page.evaluate(() => ({ viewport: innerWidth, scroll: document.documentElement.scrollWidth,
      elements: [...document.querySelectorAll('body *')].filter(e => e.getBoundingClientRect().right > innerWidth + 2).map(e => `${e.tagName}.${e.className}`).slice(0, 10) }));
    findings.push({ route, width, ...overflow });
    if (width === 390 && route === '/') {
      await page.screenshot({ path: '.artifacts/screenshots/mobile-opening.png' });
      await page.screenshot({ path: '.artifacts/screenshots/mobile-full.png', fullPage: true });
    }
    if (width === 1440) {
      if (route === '/brand.html') {
        await page.locator('#mobile').scrollIntoViewIfNeeded();
        await page.waitForTimeout(600);
        await page.evaluate(() => scrollTo(0,0));
      }
      await page.screenshot({ path: `.artifacts/screenshots/${route === '/' ? 'desktop-waitlist' : route === '/brand.html' ? 'desktop-brand' : 'privacy'}.png`, fullPage: true });
    }
  }
}
await page.setViewportSize({ width: 390, height: 844 });
await page.goto('http://127.0.0.1:4173/', { waitUntil: 'networkidle' });
await page.locator('[data-role-target="creator"]').click();
assert.equal(await page.locator('input[name="role"]:checked').inputValue(), 'creator');
await page.locator('#email').fill('not-an-email');
await page.locator('button[type="submit"]').click();
assert.match(await page.locator('#email-error').textContent(), /valid email/);
await page.locator('#email').fill('preview@example.com');
await page.locator('button[type="submit"]').click();
assert.match(await page.locator('#consent-error').textContent(), /confirm/);
await page.locator('#consent').check();
await page.locator('button[type="submit"]').click();
assert.equal(await page.locator('#signup-result').isVisible(), true);
assert.match(await page.locator('#signup-message').textContent(), /creator/);
assert.equal(await page.locator('#email').inputValue(), '');
await page.locator('#signup-result').screenshot({ path: '.artifacts/screenshots/confirmation.png' });
await page.locator('#reset-signup').click();
assert.equal(await page.locator('#waitlist-form').isVisible(), true);
await page.locator('[data-role-target="reader"]').first().click();
assert.equal(await page.locator('input[name="role"]:checked').inputValue(), 'reader');
await page.locator('#waitlist-form').screenshot({ path: '.artifacts/screenshots/mobile-form.png' });
await page.locator('#questions details').first().locator('summary').click();
assert.equal(await page.locator('#questions details').first().getAttribute('open'), '');
assert.deepEqual(await page.evaluate(() => ({ local: localStorage.length, session: sessionStorage.length })), { local: 0, session: 0 });
await page.goto('http://127.0.0.1:4173/');
await page.keyboard.press('Tab');
assert.equal(await page.evaluate(() => document.activeElement.className), 'skip-link');
await page.emulateMedia({ reducedMotion: 'reduce' });
assert.equal(await page.evaluate(() => getComputedStyle(document.documentElement).scrollBehavior), 'auto');
for (const route of ['/', '/brand.html', '/privacy.html']) {
  await page.goto('http://127.0.0.1:4173' + route);
  await page.evaluate(() => { document.documentElement.style.fontSize = '32px'; });
  const overflow = await page.evaluate(() => ({scroll:document.documentElement.scrollWidth, elements:[...document.querySelectorAll('body *')].filter(e => e.getBoundingClientRect().right>innerWidth+2).map(e=>`${e.tagName}.${e.className}`).slice(0,15)}));
  findings.push({ route, width: 390, textEnlargement: '200%', viewport: 390, ...overflow });
}
await writeFile('.artifacts/verification.json', JSON.stringify({ findings, errors, failed, external }, null, 2));
await browser.close();
console.log(JSON.stringify({ findings, errors, failed, external }, null, 2));
assert.equal(errors.length, 0, 'Browser JavaScript errors');
assert.equal(failed.length, 0, 'Broken routes or assets');
assert.equal(external.length, 0, 'Unexpected external requests');
assert.equal(findings.filter(f => f.scroll > f.viewport + 2).length, 0, 'Horizontal overflow');
