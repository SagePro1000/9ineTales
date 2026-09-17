import { chromium } from "playwright";
import { fileURLToPath } from "node:url";
import { join } from "node:path";
import { mkdir, writeFile } from "node:fs/promises";
import assert from "node:assert/strict";
const root = fileURLToPath(new URL("../", import.meta.url));
const artifacts = join(root, ".artifacts");
const assets = join(root, "public/assets");
const baseURL = (process.env.BASE_URL || "http://127.0.0.1:3000").replace(
  /\/$/,
  "",
);
const origin = new URL(baseURL).origin;
await mkdir(join(artifacts, "screenshots"), { recursive: true });
const browser = await chromium.launch({
  headless: true,
  ...(process.env.CHROME_PATH
    ? { executablePath: process.env.CHROME_PATH }
    : {}),
});
try {
  await runChecks(await browser.newPage());
} finally {
  await browser.close();
}

async function runChecks(page) {
  if (process.argv.includes("--export-assets")) {
    await mkdir(join(assets, "layouts"), { recursive: true });
    for (const name of [
      "primary",
      "primary-ink",
      "primary-reversed",
      "horizontal",
      "horizontal-ink",
      "horizontal-reversed",
      "symbol",
      "symbol-ink",
      "symbol-reversed",
    ]) {
      const dimensions = name.startsWith("primary")
        ? [1120, 816]
        : name.startsWith("horizontal")
          ? [1120, 236]
          : [512, 512];
      await page.setViewportSize({
        width: dimensions[0],
        height: dimensions[1],
      });
      await page.goto(`${baseURL}/assets/logos/${name}.svg`);
      await page.screenshot({
        path: join(assets, `logos/${name}.png`),
        omitBackground: true,
      });
    }
    for (const [name, route, width, height] of [
      ["mobile-opening", "/", 390, 1000],
      ["mobile-signup", "/#waitlist", 390, 1100],
      ["desktop-opening", "/", 1440, 960],
      ["mobile-brand", "/brand-kit/", 390, 1000],
    ]) {
      await page.setViewportSize({ width, height });
      await page.goto(`${baseURL}${route}`, { waitUntil: "networkidle" });
      await page.evaluate(() => document.fonts.ready);
      if (route.includes("#")) {
        await page
          .locator("#waitlist")
          .evaluate((element) =>
            element.scrollIntoView({ behavior: "instant", block: "start" }),
          );
        assert.ok(
          Math.abs((await page.locator("#waitlist").boundingBox()).y) < 80,
          "Direct signup link positioning",
        );
      }
      await page.waitForTimeout(300);
      await page.screenshot({ path: join(assets, `layouts/${name}.png`) });
    }
    console.log(
      "Exported 9 transparent logo PNGs and 4 desktop/mobile layout previews.",
    );
    return;
  }
  const errors = [],
    failed = [],
    external = [],
    submissions = [];
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("response", (response) => {
    if (response.status() >= 400) failed.push(response.url());
  });
  page.on("request", (request) => {
    if (
      new URL(request.url()).origin !== origin &&
      !request.url().startsWith("data:")
    )
      external.push(request.url());
    if (!["GET", "HEAD"].includes(request.method())) {
      submissions.push({ url: request.url(), method: request.method() });
    }
  });
  const findings = [];
  for (const route of ["/", "/brand-kit/", "/privacy/"]) {
    for (const width of [320, 360, 390, 768, 1440]) {
      await page.setViewportSize({ width, height: 900 });
      await page.goto(`${baseURL}${route}`, { waitUntil: "networkidle" });
      await page.evaluate(() => document.fonts.ready);
      const overflow = await page.evaluate(() => ({
        viewport: innerWidth,
        scroll: document.documentElement.scrollWidth,
        elements: [...document.querySelectorAll("body *")]
          .filter((e) => e.getBoundingClientRect().right > innerWidth + 2)
          .map((e) => `${e.tagName}.${e.className}`)
          .slice(0, 10),
      }));
      findings.push({ route, width, ...overflow });
      if (width === 390 && route === "/") {
        await page.screenshot({
          path: join(artifacts, "screenshots/mobile-opening.png"),
        });
        await page.screenshot({
          path: join(artifacts, "screenshots/mobile-full.png"),
          fullPage: true,
        });
      }
      if (width === 1440) {
        if (route === "/brand-kit/") {
          await page.locator("#mobile").scrollIntoViewIfNeeded();
          await page.waitForTimeout(600);
          await page.evaluate(() => scrollTo(0, 0));
        }
        await page.screenshot({
          path: join(
            artifacts,
            `screenshots/${route === "/" ? "desktop-waitlist" : route === "/brand-kit/" ? "desktop-brand" : "privacy"}.png`,
          ),
          fullPage: true,
        });
      }
    }
  }
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(`${baseURL}/`, { waitUntil: "networkidle" });
  await page.waitForFunction(() => {
    const submit = document.querySelector('button[type="submit"]');
    return submit instanceof HTMLButtonElement && !submit.disabled;
  });
  await page.locator('[data-role-target="creator"]').click();
  assert.equal(
    await page.locator('input[name="role"]:checked').inputValue(),
    "creator",
  );
  await page.locator("#email").fill("not-an-email");
  await page.locator('button[type="submit"]').click();
  assert.match(await page.locator("#email-error").textContent(), /valid email/);
  await page.locator("#email").fill("preview@example.com");
  assert.equal(
    await page.locator("#email-error").textContent(),
    "",
    "Corrected email clears its error",
  );
  await page.locator('button[type="submit"]').click();
  assert.match(await page.locator("#consent-error").textContent(), /confirm/);
  await page.locator("#consent").check();
  assert.equal(
    await page.locator("#consent-error").textContent(),
    "",
    "Checked consent clears its error",
  );
  await page.locator('[data-role-target="reader"]').first().click();
  assert.equal(
    await page.locator("#email").inputValue(),
    "preview@example.com",
    "Audience CTA preserves the email draft",
  );
  assert.equal(
    await page.locator("#consent").isChecked(),
    true,
    "Audience CTA preserves consent",
  );
  await page.locator('[data-role-target="creator"]').click();
  assert.equal(
    await page.locator("#email").inputValue(),
    "preview@example.com",
  );
  await page
    .locator('[data-role-target="reader"]')
    .first()
    .evaluate((link) => {
      // Suppress navigation while exercising the modified-click handler.
      link.addEventListener("click", (event) => event.preventDefault(), {
        once: true,
      });
      link.dispatchEvent(
        new MouseEvent("click", {
          bubbles: true,
          cancelable: true,
          ctrlKey: true,
        }),
      );
    });
  assert.equal(
    await page.locator('input[name="role"]:checked').inputValue(),
    "creator",
    "Modified audience click leaves the current form unchanged",
  );
  await page.locator('button[type="submit"]').click();
  assert.equal(await page.locator("#signup-result").isVisible(), true);
  assert.match(await page.locator("#signup-message").textContent(), /creator/);
  assert.equal(await page.locator("#email").inputValue(), "");
  await page
    .locator("#signup-result")
    .screenshot({ path: join(artifacts, "screenshots/confirmation.png") });
  await page.locator('[data-role-target="reader"]').first().click();
  assert.equal(
    await page.locator("#waitlist-form").isVisible(),
    true,
    "Audience CTA starts a new preview after completion",
  );
  assert.equal(await page.locator("#consent").isChecked(), false);
  await page.locator("#email").fill("reset@example.com");
  await page.locator("#consent").check();
  await page.locator('button[type="submit"]').click();
  await page.locator("#reset-signup").click();
  assert.equal(await page.locator("#waitlist-form").isVisible(), true);
  await page.locator('[data-role-target="reader"]').first().click();
  assert.equal(
    await page.locator('input[name="role"]:checked').inputValue(),
    "reader",
  );
  await page
    .locator("#waitlist-form")
    .screenshot({ path: join(artifacts, "screenshots/mobile-form.png") });
  await page.locator("#questions details").first().locator("summary").click();
  assert.equal(
    await page.locator("#questions details").first().getAttribute("open"),
    "",
  );
  assert.deepEqual(
    await page.evaluate(() => ({
      local: localStorage.length,
      session: sessionStorage.length,
    })),
    { local: 0, session: 0 },
  );
  await page.goto(`${baseURL}/`);
  await page.keyboard.press("Tab");
  assert.equal(
    await page.evaluate(() => document.activeElement.className),
    "skip-link",
  );
  await page.emulateMedia({ reducedMotion: "reduce" });
  assert.equal(
    await page.evaluate(
      () => getComputedStyle(document.documentElement).scrollBehavior,
    ),
    "auto",
  );
  for (const route of ["/", "/brand-kit/", "/privacy/"]) {
    await page.goto(baseURL + route);
    await page.evaluate(() => {
      document.documentElement.style.fontSize = "32px";
    });
    const overflow = await page.evaluate(() => ({
      scroll: document.documentElement.scrollWidth,
      elements: [...document.querySelectorAll("body *")]
        .filter((e) => e.getBoundingClientRect().right > innerWidth + 2)
        .map((e) => `${e.tagName}.${e.className}`)
        .slice(0, 15),
    }));
    findings.push({
      route,
      width: 390,
      textEnlargement: "200%",
      viewport: 390,
      ...overflow,
    });
  }
  await writeFile(
    join(artifacts, "verification.json"),
    JSON.stringify({ findings, errors, failed, external }, null, 2),
  );
  console.log(
    JSON.stringify(
      {
        layoutsChecked: findings.length,
        overflow: findings.filter((f) => f.scroll > f.viewport + 2),
        errors,
        failed,
        external,
      },
      null,
      2,
    ),
  );
  assert.equal(errors.length, 0, "Browser JavaScript errors");
  assert.equal(failed.length, 0, "Broken routes or assets");
  assert.equal(external.length, 0, "Unexpected external requests");
  assert.equal(submissions.length, 0, "Demo form sends no submissions");
  assert.equal(
    findings.filter((f) => f.scroll > f.viewport + 2).length,
    0,
    "Horizontal overflow",
  );

  const noJS = await browser.newContext({ javaScriptEnabled: false });
  try {
    const noJSPage = await noJS.newPage();
    await noJSPage.goto(`${baseURL}/`);
    assert.equal(
      await noJSPage.locator('button[type="submit"]').isDisabled(),
      true,
    );
    await noJSPage.locator("#email").fill("private@example.com");
    await noJSPage.locator("#email").press("Enter");
    assert.equal(
      noJSPage.url(),
      `${baseURL}/`,
      "No-JavaScript form does not send email via URL",
    );
    assert.equal(await noJSPage.locator("#email").getAttribute("name"), null);
  } finally {
    await noJS.close();
  }
  console.log(
    "Passed layout, form, keyboard, reduced-motion, asset and no-JavaScript checks.",
  );
}
