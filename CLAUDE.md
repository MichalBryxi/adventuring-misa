# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

"Adventuring Míša" - a personal outdoor blog (trail running, hiking, T6 scrambles, Munros, gear reviews). It replaces sportsting-misa.pudr.com (`../sportsting-misa`) (empress-blog), keeping its URLs. It is a compatless (Polaris) Ember 7 app on Vite, with WarpDrive for data and Tailwind CSS 4 for styling; the layout is adapted from the Tailwind Plus "Transmit" template (licensed for this site only, see README). Every page is prerendered to static HTML at build time and the app rehydrates it in the browser.

## Commands

Node 24 + pnpm 10 (`.node-version`, `mise.toml`, `packageManager`, `netlify.toml` - keep them in sync).

- `pnpm start` - dev server (Vite, http://localhost:4200), content edits reload live
- `pnpm build` - production build into `dist/`, including the prerender of every route
- `pnpm test:output` - after `pnpm build`: every post/page was prerendered with its content, RSS is complete (`tests/output/`, `node --test`). Netlify runs it after the build.
- `pnpm test` - builds in test mode (no prerender) and runs the QUnit acceptance tests in headless Chrome against the dummy posts in `tests/fixtures/content/` (the `@content` alias in `vite.config.mjs`), not the real ones, so editing a post never breaks a test. A test that needs a new kind of content gets it in a fixture.
- `pnpm lint` / `pnpm lint:fix`, `pnpm lint:types` (Glint)

## Content

All content is Markdown under `content/`, front matter in YAML:

- `content/posts/<slug>/index.md` - a post; its photos and files sit next to it and are referenced relatively (`![…](./01.jpg)`, `image: ./cover.jpg`). The folder name is the URL (`/<slug>`), dated `YYYY-MM-DD-…`. Cross-links to other posts are files, `../2021-06-07-an-teallach/index.md`, so they also work in Obsidian; `lib/markdown.mjs` turns them into post URLs.
- The writing lives only here. The Obsidian vault (`~/Library/Mobile Documents/iCloud~md~obsidian/Documents/Míša`) has no copy of the posts, only a fact note per trip, race or piece of gear, in its own folder (`Trip/T6/`, `Trip/Hiking/`, `Trip/Climbing/`, `Competition/`, `Gear/<kind>/`, …): properties for filtering in Bases (`Date`, `Distance [km]`, `Ascent [m]`, `Time [hh:mm]`, `Moving [hh:mm]`, `Stars`, `Strava`, `URL`, `Done`, tags like `T6`, `Fun/Type-1`), links and GPX, and a `Blog:` property plus a `## Blog` section linking to the post on the web. A new post gets such a note (or the existing one gets the `Blog` link); the "On the blog" view of `_/Blog.base` lists them.
  Numbers about the trip go in `facts:` (date, location, grade, points as `{ name, altitude, link }` in order, distance in km, ascent in m, duration/movingTime as h:mm[:ss], plus free-form `more:` rows and `links:`; see `lib/facts.mjs`). The typed values reach the store for filtering (`post.facts.ascent`), and the table is rendered before the story and in the feed; don't write facts tables or Stats lists in the text.
  What I did right and wrong goes in `learnings:`, a list of `{ text, good: true|false, note }` shown as a Learnings checklist (✅ / ❌) after the story, before the gallery (`lib/learnings.mjs`); a note says why it mattered. A `<!-- learnings -->` line in the text puts the checklist there instead, on the site and in the feed (`app/content/learnings.ts`).
  Photos of the trip go in the front matter rather than the text: `gallery:` is a list of `{ src: ./01.jpg, caption: … }`, shown as a masonry grid with a lightbox at the end of the post (`app/components/gallery.gts`). Keep a photo inline only when the text refers to it where it is (the Windy, Suunto and Magic Pass posts).
  A post with `published: false` is a draft: `pnpm start` shows it with a Draft ribbon (`app/components/draft-ribbon.gts`), `pnpm build` (and `pnpm test`) leave it out of the pages, the feed and the bundle (`lib/content.mjs`, `lib/vite-plugin-blog.mjs`). Without the key a post is published.
- `content/pages/<slug>/index.md` - standalone pages (`/page/<slug>`)
- Tags in a post's `tags:` are dasherised ids, optionally in one level of group like Obsidian's nested tags: `munro`, `fun/type-3`, `rating/4-stars`, `t-grade/t6`. Their names come from ember-intl: `translations/en-us.json` has `tag.<id>` for every tag and every group (`tag.rating`), and templates show them with `{{t (tagKey id)}}`. The build fails on a tag without a translation. The intl service is registered in `app/app.ts`, and `app/routes/application.ts` loads the translations; English is the only locale so far.
- The sidebar tags (`app/components/tag-filter.gts`, `app/content/tag-cloud.ts`) filter the front page: `/?tags=munro,rating/4-stars` lists posts with all of them (AND, `app/content/tag-filter.ts`). Tag links in posts go there too. Altitude gain, Distance, Time and Gradient are filters too, but not in the front matter: `app/content/fact-tags.ts` derives tags like `ascent/under-1500m` from `facts:` (ascent, distance, duration or else movingTime, and ascent over distance as the gradient, `gradient/under-10pct`). They are intervals named by their upper limit (`< 1500 m` is from the limit below up to 1500 m), each post in one a group; the last is open (`ascent/over-2000m`, "> 2000 m"). The limits are round numbers (1, 1.5, 2, 3, 5 × 10ⁿ; steps of 5 % for the gradient), each the one just above a post's value, at most 5 a group: the sparsest interval merges into its smaller neighbour. There are no tag pages: `netlify.toml` redirects the old `/tag/<id>` URLs to `/?tags=<id>` (ratings, T6 and type 3 fun to their group ids).
- `content/cover.jpg` - the sidebar image
- `public/gpx/` - GPX/KML route files. They stay outside the bundler because the swisstopo map embed needs a stable absolute URL for the KML.

Markdown is not prettier-formatted.

Never use an em dash or en dash anywhere in the project (content, code, docs, titles): write a plain minus `-` instead.

## How it fits together

- `lib/vite-plugin-blog.mjs` makes the Markdown importable: `index.md?meta` is the front matter plus an excerpt, `index.md` is the rendered HTML (`lib/markdown.mjs`, unified/remark/rehype with GFM tables and raw HTML). Relative asset paths become imports, so Vite fingerprints the photos. It also writes `rss.xml`.
- The app imports the Markdown through `import.meta.glob('@content/…')`; `app/content/by-folder.ts` keys those modules by id.
- `app/content/handler.ts` is a WarpDrive request handler that answers JSON:API requests (`/posts`, `/posts/<id>`, `/tags/<id>`, …) from those modules - there is no server or fetch. Front matter of everything is in the main bundle; a post's HTML is a lazy chunk. Only front-matter keys that have a field in `app/content/schemas.ts` reach the store: add a field there to use a new key.
- Photos are resized at build time by `@responsive-image/vite-plugin` (480/960/1440 px, WebP + JPEG; `vite.config.mjs`). The blog plugin imports every relative photo with `?responsive`: photos in the Markdown get `srcset`/`sizes`/`width`/`height` from `app/content/photo.ts`, covers are rendered with `<ResponsiveImage>` and looked up in `app/content/covers.ts` (the `cover` export of the `?meta` module, kept out of the store), gallery photos are the `gallery` export of a post's HTML module, loaded by the post route (`app/content/gallery.ts`), and the RSS feed links the 960 px JPEGs, gallery included. The first build encodes every photo and is slow; later builds use the plugin's cache.
- `app/content/requests.ts` - the requests the routes make; `app/routes/*` await them so the prerender has the data.
- `site.mjs` - title, tagline and navigation, shared by the app and the build.
- Layout: from `lg` up the sidebar is fixed on the left (`app/templates/application.gts`); below it `app/components/mobile-nav.gts` shows a top bar whose menu opens the same Explore and TagFilter components in a Frontile Drawer (`frontile/overlays`, rendered into the `<PortalTarget>` at the end of the application template). Frontile's theme comes in through `app/styles/app.css` (`@import "@frontile/theme"`, its plugin, and `@source` lines for its classes in node_modules).
- The mobile menu button opens the drawer `{{on "click"}}`, not with Frontile's `@onPress`: that fires on `pointerup`, and the tap's click that follows lands on the new backdrop and closes the drawer (Frontile 0.18.10).
- PWA (`vite-plugin-pwa` in `vite.config.mjs`, build only, not in tests): the manifest, the icons generated from `public/favicon.svg` (`pwaAssets`, so no PNGs in the repo) with their `<link>`s injected into the head, and a Workbox service worker. It runs after the prerender (`closeBundleOrder: 'post'`) so it precaches every prerendered page; photos are cached at runtime, not precached.
- Prerendering is `vite-ember-ssr`'s `emberSsg` (`vite.config.mjs`); the route list comes from `lib/content.mjs`. `app/app-ssr.ts` is its entry, `app/entry.ts` rehydrates in the browser. The SSG plugin is limited to `vite build`: its `closeBundle` also runs when a dev server stops or restarts and would prerender over `dist/`. vite-ember-ssr only supports compatless apps: no `@embroider/compat`, no `ember-cli-build`, no classic addons.
- Styling: Tailwind utility classes in the `.gts` templates; post bodies use `@tailwindcss/typography` (`app/components/prose.gts`).
- The About me page (`/page/about-me`) is not Markdown: its text, cards, timeline and links are data in `app/templates/about-me.gts`, rendered by `app/components/sections.gts` (cards / timeline / links, from Tailwind Plus). Text there is hand-written HTML.
- Licensing: code is MIT except the Transmit-derived layout files listed in `LICENSE` (Tailwind Plus licence, not ours to give away); content is CC BY-NC-SA 4.0. When a new component or template copies markup or styling from Transmit, add it to that list. Keep the README framing the repo as this site's source, not a reusable template.
- `netlify.toml` - CSP and other headers, GPX headers, redirects of old URLs.
