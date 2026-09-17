# 9inetales — Next.js waitlist & brand kit

An editable Next.js App Router project with TypeScript, React, and plain CSS. The original visual direction, copy, fonts, logos, and demonstration signup are preserved.

## Open in Cursor

Open this project folder using **File → Open Folder**, or open `9inetales.code-workspace`. If Cursor’s terminal command is installed, you can also run `cursor .` from this directory.

Use Node.js 20.9 or later. A current Node.js LTS release is recommended. Dependencies have been installed in this workspace; on another machine, run `npm ci` first.

```bash
npm run dev
```

Open the local address printed in the terminal, normally http://localhost:3000. Edits to the source update the preview automatically.

## Pages

| URL           | Source                       |
| ------------- | ---------------------------- |
| `/`           | `src/app/page.tsx`           |
| `/brand-kit/` | `src/app/brand-kit/page.tsx` |
| `/privacy/`   | `src/app/privacy/page.tsx`   |

## What to edit

| Change                                                | File or folder                                 |
| ----------------------------------------------------- | ---------------------------------------------- |
| Page section order                                    | `src/app/page.tsx`                             |
| Opening headline, artwork, and description            | `src/components/waitlist/hero-section.tsx`     |
| Reader benefits                                       | `src/components/waitlist/reader-section.tsx`   |
| Creator information                                   | `src/components/waitlist/creator-section.tsx`  |
| Publishing journey                                    | `src/components/waitlist/process-section.tsx`  |
| Signup introduction                                   | `src/components/waitlist/waitlist-section.tsx` |
| Signup fields, validation, and confirmation           | `src/components/waitlist/waitlist-form.tsx`    |
| Reader/creator preselection                           | `src/components/waitlist/waitlist-context.tsx` |
| Frequently asked questions                            | `src/components/waitlist/faq-section.tsx`      |
| Shared header, footer, and preview banner             | `src/components/site-shell.tsx`                |
| Brand guide content                                   | `src/components/brand/brand-guide.tsx`         |
| Click-to-copy colour swatches                         | `src/components/brand/colour-palette.tsx`      |
| Colours, font families, and spacing tokens            | `src/styles/tokens.css`                        |
| Waitlist layouts and responsive styles                | `src/styles/globals.css`                       |
| Brand guide styles                                    | `src/styles/brand.css`                         |
| Local font declarations                               | `src/styles/fonts.css`                         |
| Site title, description, and icon                     | `src/app/layout.tsx`                           |
| Artwork, logos, fonts, downloads, and layout previews | `public/assets/`                               |

Files under `src/` and `public/` are the editable application source. Do not edit `.next/` or `out/`; they are generated build output.

The original plain HTML/CSS/JS prototype is preserved under `legacy/static-prototype/` as a historical reference. Its old scripts are not loaded by the React app. Brand documentation and the original logo remain in `brand/`.

## Build and check

```bash
npm run typecheck
npm run build
npm run start
```

`build` creates the normal Next.js production build; `start` runs that build. Stop the development server first if both would use port 3000.

```bash
npm run format
```

Formats the application code, CSS, and key project files. The workspace recommends the Prettier extension for formatting on save.

For browser verification, install Playwright’s browser once:

```bash
npx playwright install chromium
```

With `npm run dev` or `npm run start` running, use a second terminal:

```bash
npm run verify
```

This checks all three pages at mobile, tablet, and desktop widths; enlarged text; signup validation, draft preservation, and reset; keyboard entry; reduced motion; and submission safety with JavaScript disabled. Screenshots and the layout report are written to `.artifacts/`. These automated checks do not replace testing with readers and creators on real devices.

For a different server address, use `BASE_URL=http://127.0.0.1:3001 npm run verify`. Set `CHROME_PATH` to use an existing Chrome executable instead of the installed Playwright browser.

## Optional static export

```bash
npm run export
```

Builds a static copy into `out/`. This is suitable for the existing Sites static-hosting configuration. `npm run start` is for a normal `npm run build`, not a static export; after exporting, run a normal build again before using `start`, or serve `out/` with a static server.

The hosting manifest retains the existing private review-site ID. This migration is local code work and does not change the previously published review site. A later publish must build and upload the new source explicitly.

## Signup is still a prototype

The form demonstrates audience selection, email validation, consent, confirmation, and reset. It does not send email, save addresses, call an API, or integrate a mailing list. The email is cleared when demonstrating submission.

To launch a real waitlist, replace the demonstration handler with a suitable server-side integration and implement provider secrets, server validation, consent records, spam protection, deduplication, email verification, unsubscribe, and a real privacy notice. See `brand/REVIEW-PLAN.md`. Static export cannot host a dynamic Next.js signup API; use a separate backend or the normal server build for that stage.

The identity and copy remain review drafts. Generated concept art is explicitly labelled. Founder review, name clearance, and real-device/participant testing remain necessary before public launch.

Framework references: [Next.js installation](https://nextjs.org/docs/app/getting-started/installation) and [static export guide](https://nextjs.org/docs/app/guides/static-exports).
