# Verification

Verified on November 10, 2026 using Node.js 24 and Microsoft Edge on Windows.

## Automated checks

- `node --check src/app.js`: passed.
- `node --test tests/guide.test.mjs`: **7 passed, 0 failed**.
- `node scripts/build.mjs`: passed; static output and HTML-referenced assets exist in `dist/`.
- `tests/browser-smoke.mjs` with the installed taste skill CDP helper: **22 passed** against the built website.

The browser checks cover all four home entry points, required symptom selection, emergency access without a symptom, skip-link route preservation, all three care levels, location-aware map links, every journey stage, checklist persistence, printable care summary, Korean symptom search, empty results, stroke override, seven medicine topics, special-circumstance guidance, insurance deep-link focus, and absence of uncaught browser errors.

All seven routes rendered without horizontal overflow or broken images at **1440, 768, 390, and 375 pixels**.

## Design inspection

The taste skill inspector measured the homepage at 1440, 768, and 390 pixels: **0 failures, 3 warnings** with the documented `few-pictures` exception. Hero headlines stay within two lines. The source pattern scan reports **0 failures, 1 warning**.

Remaining warnings are intentional:

- Typography includes utility navigation, captions, forms, body copy, and a large 119 callout, so it exceeds a five-size editorial scale.
- No background footage: this is a functional medical guide rather than a promotional film.
- Ten entrance animations with reduced-motion support; the guide prioritizes stable reading over more motion.
- The print stylesheet uses outlines to separate documents and instructions on paper.
- One relevant illustrative photo instead of a four-image gallery; the guide's main content is interactive information.

Reviewed rendered desktop, tablet, and mobile homepages, plus hospital selection, care results, medicine selection, and emergency screens. Internal visual assessment: design 8/10, usability 8/10, creativity 7/10, content 8/10 (weighted 7.8/10). The functional guide and emergency view are deliberately quiet.

## Review fixes

A separate static code review identified a skip-link bug: `#main` previously caused the router to replace the active page with Home. The link now focuses the current main content without changing the route. The browser smoke test verifies this on the emergency page.

The emergency checkbox also routes directly to emergency instructions before the required symptom field can block navigation. The smoke test covers this with an empty form.

## Limits

- No live provider directory, live opening hours, booking integration, or medical diagnosis engine. Map links search external services and tell users to confirm suitability and availability.
- Korean audio depends on an installed browser/device voice. The written Korean and pronunciations remain available if audio is unavailable. Clipboard failures display a manual-copy instruction.
- No personalized medicine dose or insurance eligibility calculation. Source links, pharmacist checks, and policy-specific document instructions accompany the content.
- The printable care guide was generated successfully as a PDF. It is a reference handout, not a medical record.
- No Cloudflare account deployment or live-domain verification was performed. Build configuration and instructions are included for the requested later deployment.
