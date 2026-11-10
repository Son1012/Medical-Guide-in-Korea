# Design and implementation notes

## Brief

An English guide for foreign visitors in Korea. The home page must offer hospital, medicine, emergency, and other-information choices. Follow the care journey from symptoms to insurance paperwork. Keep the pamphlet’s three care levels and medicine topics, with corrections or cautions when source information needs verification. Deliver static code to the requested GitHub repository for later Cloudflare deployment.

## Direction

Apple reference: white `#ffffff`, light canvas `#f5f5f7`, ink `#1d1d1f`, action blue `#0066cc`, system sans-serif, large close-set headings, quiet interface chrome, and generous spacing. Emergency actions use a separate dark red. No decorative gradients, fake statistics, testimonials, or claims of provider endorsement.

The taste skill dealt **The split stage**, seed **495121116**, with the Apple palette and type retained. The generated homepage reference supplies the final hero proportions: a 50/50 heading-and-photo composition. The guide uses a stable sidebar beside step-by-step reading on larger screens and a single column on phones. The requested four entry choices become direct text-and-arrow links on subtle filled surfaces, without decorative icon headers.

The idea: the pamphlet’s sequence of choosing a department, visiting, paying, and collecting documents becomes a single care journey. The interactive element is the symptom/severity selector, followed by Korean terms that users can show, copy, or hear.

The functional healthcare guide uses one relevant illustrative photo. We deliberately omit a gallery and background footage: neither helps someone find care, and both add visual/connection load. This is a documented exception to the taste skill’s generic picture-count floor. Small form labels, utility navigation, captions, and legal/source notes retain distinct sizes; running guide text stays at a readable body size.

## Structure

- `#home`: hero, four choices, care journey overview, emergency access.
- `#hospital`: searchable pamphlet topics, three care needs, area, emergency check.
- `#care`: recommendation, department and symptom Korean, five visit stages.
- `#medicine`: seven medicine topics, ingredient cautions, pharmacy locator links.
- `#emergency`: 119, warning signs, Korean communication, 1330/112 distinctions.
- `#visit`: complete visit guide, insurance, documents, and questions.
- `#sources`: scope, privacy, medicine caveats, source links, and image disclosure.

The app uses plain HTML/CSS/ES modules to avoid framework runtime and build dependencies. No accounts or medical data storage. Map searches explicitly open third-party services. The source repository was empty; the existing parent Game1 repository and unrelated files were left in place.

## Generated images

Both images used the built-in ImageGen tool. The mockup served as a design reference; it is not used as website UI. The selected scene was compressed to WebP using Pillow without changing its content. Production asset: `assets/clinic.webp` (1536 × 1024).

### UI reference prompt

> Use case: ui-mockup. Design a polished desktop homepage for 'Care in Korea', an English healthcare navigation guide for foreign visitors. Apple website level restraint, warm white #f5f5f7 and charcoal #1d1d1f, subtle blue #0066cc links. 1440px wide layout. Small plain header with simple typographic brand, Hospital guide, Medicine guide, Your visit, and red 'Emergency 119'. Hero left says exactly 'Feel better. Know where to go.' in large confident black modern sans serif, supporting text 'Your guide to healthcare in Korea, from your first symptom to your final receipt.' one blue pill 'Find the right care'. Right hero photographic architectural study of Korean neighborhood clinic facade and illuminated green pharmacy cross/약 sign, daylight, quiet street, cropped into a large clean rectangular frame with 24px corners, no fake UI overlay. Below hero a four-choice flat editorial action area: Find a hospital / Find medicine / Get emergency help / Before & after your visit, different subtle background tones, restrained thin line symbols. Navigation utility typography, no eyebrows, no stats, no testimonials, no excessive nested cards, no gradients, no floating objects. Clean readable first viewport, approx 900px high. Render a standalone website design reference.

### Website image prompt

> Use case: photorealistic-natural. Asset type: premium healthcare guide website hero image, landscape 3:2. Primary request: architectural editorial photograph of a typical small Korean neighborhood clinic and adjacent pharmacy facade in Seoul, serene sunny morning. Ground floor clean glass entry, light stone facade, understated Korean clinic lettering '의원', a realistic small illuminated green pharmacy cross sign containing '약', subtle pharmacy shelves through the window, a gingko or zelkova tree casting dappled leaf shadows, pale stone sidewalk. Composition shot straight on with slight perspective down the street, facade and pharmacy sign visible within middle 75% of frame so mobile crop works. Quiet human scale, welcoming everyday Seoul, realistic materials, professional architecture magazine photography, balanced natural light, warm-neutral white and sage green, subtle film grain. No people, no cars, no extra foreground objects, no written English text, no brand logos, no watermark, no UI, no mockup or border. This is an illustrative scene, not a real identifiable provider.

## Verification

Node tests cover care-level mapping across the symptom set, emergency overrides, invalid input, English/Korean search, medicine-topic data, and map query encoding. The static build checks the local assets referenced in HTML. Additional browser verification and review results are recorded in `docs/verification.md`.
