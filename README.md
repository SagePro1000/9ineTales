# 9inetales waitlist

Independent Next.js App Router waitlist with TypeScript, React, and plain CSS. This folder is the active waitlist project and the starting point for version 2.

The independent brand and design-kit project is in `/Users/user/Desktop/9ineTales design`. Design-kit routes, source components, downloads, brand masters, marketing assets, and the historical static prototype have moved there. The waitlist has no imports, embeds, symlinks, or navigation links to that project.

## Open and run

Open this folder or `9inetales.code-workspace` in Cursor. Use Node.js 20.9 or later; run `npm ci` on a fresh machine.

```sh
npm run dev
```

Open http://localhost:3000. The design kit uses port 3001, so both projects can run at once.

## Pages and source

| Purpose                                             | File                            |
| --------------------------------------------------- | ------------------------------- |
| Waitlist page and section order                     | `src/app/page.tsx`              |
| Waitlist privacy notice                    | `src/app/privacy/page.tsx`      |
| Header and footer              | `src/components/site-shell.tsx` |
| Waitlist sections and demonstration form            | `src/components/waitlist/`      |
| Local colour, typography, and spacing tokens        | `src/styles/tokens.css`         |
| Responsive layout and focus styles                  | `src/styles/globals.css`        |
| Local font declarations                             | `src/styles/fonts.css`          |
| Site metadata and favicon                           | `src/app/layout.tsx`            |
| Required logos, fonts, licences, and hero artwork   | `public/assets/`                |
| Copy, launch review reference, and font attribution | `docs/`                         |
| Browser verification                                | `scripts/verify.mjs`            |

Edit `src/` and `public/assets/`. `.next/`, `out/`, and `.artifacts/` are generated or local tooling output.

## Verify and build

```sh
npm run typecheck
npm run build
npm run start
```

With a local server running:

```sh
npm run verify
```

Verification covers the waitlist and privacy pages at mobile, tablet, and desktop widths, enlarged text, signup validation and draft handling, keyboard access, reduced motion, local assets, and submission safety with JavaScript disabled. Reports and screenshots are in `.artifacts/`. Install a browser with `npx playwright install chromium`, or set `CHROME_PATH` to an existing Chrome executable. `BASE_URL` overrides the default http://127.0.0.1:3000.

```sh
npm run format
npm run export
```

`export` builds static output in `out/` for the existing hosting manifest. After a static export, run a normal build before `npm run start`, or serve `out/` with a static server. Local separation does not update a previously published site.

## Signup remains a demonstration

The form demonstrates audience selection, email validation, consent, confirmation, and reset. It does not send email, save addresses, call an API, or integrate a mailing list. The email clears on demonstration submission.

Before launching collection, implement server validation, consent records, spam protection, deduplication, email verification, unsubscribe, and an operator-specific privacy notice. See `docs/REVIEW-PLAN.md`. Static export requires a separate signup backend.

## Brand updates

The design folder holds editable brand masters. This project retains independent copies of only the logos, font files, licences, artwork, and CSS tokens it currently uses. After approving a brand change, deliberately copy the required assets and tokens here, then verify the waitlist. Changes to either folder do not automatically change the other.

The identity and copy remain review drafts. Artwork is a supplied visual reference, not evidence of a launch catalogue or creator partnership. No launch dates or commercial terms are confirmed by this prototype.
