# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

"Adventuring Míša" — a personal outdoor blog (trail running, hiking, T6 scrambles, Munros, gear reviews). It replaces sportsting-misa.pudr.com (`../sportsting-misa`) (empress-blog), keeping its URLs. It is a compatless (Polaris) Ember 7 app on Vite, with WarpDrive for data and Tailwind CSS 4 for styling; the layout is adapted from the Tailwind Plus "Transmit" template (licensed for this site only, see README). Every page is prerendered to static HTML at build time and the app rehydrates it in the browser.

## Commands

Node 24 + pnpm 10 (`.node-version`, `mise.toml`, `packageManager`, `netlify.toml` — keep them in sync).

- `pnpm start` — dev server (Vite, http://localhost:4200), content edits reload live
- `pnpm build` — production build into `dist/`, including the prerender of every route
- `pnpm test:output` — after `pnpm build`: every post/page was prerendered with its content, RSS is complete (`tests/output/`, `node --test`). Netlify runs it after the build.
- `pnpm test` — builds in test mode (no prerender) and runs the QUnit acceptance tests in headless Chrome against the dummy posts in `tests/fixtures/content/` (the `@content` alias in `vite.config.mjs`), not the real ones, so editing a post never breaks a test. A test that needs a new kind of content gets it in a fixture.
- `pnpm lint` / `pnpm lint:fix`, `pnpm lint:types` (Glint)

## Content

All content is Markdown under `content/`, front matter in YAML:

- `content/posts/<slug>/index.md` — a post; its photos and files sit next to it and are referenced relatively (`![…](./01.jpg)`, `image: ./cover.jpg`). The folder name is the URL (`/<slug>`), dated `YYYY-MM-DD-…`. Cross-links to other posts are files, `../2021-06-07-an-teallach/index.md`, so they also work in Obsidian; `lib/markdown.mjs` turns them into post URLs.
- The Obsidian vault keeps a copy of `content/posts` in `Blog/Adventuring Míša/` (same folders and files). Edit here, then copy there.
  Numbers about the trip go in `facts:` (date, location, grade, points as `{ name, altitude, link }` in order, distance in km, ascent in m, duration/movingTime as h:mm[:ss], plus free-form `more:` rows and `links:`; see `lib/facts.mjs`). The typed values reach the store for filtering (`post.facts.ascent`), and the table is rendered before the story and in the feed; don't write facts tables or Stats lists in the text.
  What I carried goes in `gear:`, a list of `{ item, packed: true|false, note }` shown as a checklist after the story, before the gallery (`lib/gear.mjs`); a note says why a missing item mattered. A `<!-- gear -->` line in the text puts the checklist there instead, on the site and in the feed (`app/content/gear.ts`).
  Photos of the trip go in the front matter rather than the text: `gallery:` is a list of `{ src: ./01.jpg, caption: … }`, shown as a masonry grid with a lightbox at the end of the post (`app/components/gallery.gts`). Keep a photo inline only when the text refers to it where it is (the Windy, Suunto and Magic Pass posts).
  A post with `published: false` is a draft: `pnpm start` shows it with a Draft ribbon (`app/components/draft-ribbon.gts`), `pnpm build` (and `pnpm test`) leave it out of the pages, the feed and the bundle (`lib/content.mjs`, `lib/vite-plugin-blog.mjs`). Without the key a post is published.
- `content/pages/<slug>/index.md` — standalone pages (`/page/<slug>`)
- Tags in a post's `tags:` are dasherised ids, optionally in one level of group like Obsidian's nested tags: `munro`, `type-3-fun`, `rating/4-stars`, `t-grade/t6`. Their names come from ember-intl: `translations/en-us.json` has `tag.<id>` for every tag and every group (`tag.rating`), and templates show them with `{{t (tagKey id)}}`. The build fails on a tag without a translation. The intl service is registered in `app/app.ts`, and `app/routes/application.ts` loads the translations; English is the only locale so far.
- The sidebar tags (`app/components/tag-filter.gts`, `app/content/tag-cloud.ts`) filter the front page: `/?tags=munro,rating/4-stars` lists posts with all of them (AND, `app/content/tag-filter.ts`). Tag links in posts go there too. There are no tag pages: `netlify.toml` redirects the old `/tag/<id>` URLs to `/?tags=<id>` (ratings and T6 to their group ids).
- `content/cover.jpg` — the sidebar image
- `public/gpx/` — GPX/KML route files. They stay outside the bundler because the swisstopo map embed needs a stable absolute URL for the KML.

Markdown is not prettier-formatted.

## How it fits together

- `lib/vite-plugin-blog.mjs` makes the Markdown importable: `index.md?meta` is the front matter plus an excerpt, `index.md` is the rendered HTML (`lib/markdown.mjs`, unified/remark/rehype with GFM tables and raw HTML). Relative asset paths become imports, so Vite fingerprints the photos. It also writes `rss.xml`.
- The app imports the Markdown through `import.meta.glob('@content/…')`; `app/content/by-folder.ts` keys those modules by id.
- `app/content/handler.ts` is a WarpDrive request handler that answers JSON:API requests (`/posts`, `/posts/<id>`, `/tags/<id>`, …) from those modules — there is no server or fetch. Front matter of everything is in the main bundle; a post's HTML is a lazy chunk. Only front-matter keys that have a field in `app/content/schemas.ts` reach the store: add a field there to use a new key.
- Photos are resized at build time by `@responsive-image/vite-plugin` (480/960/1440 px, WebP + JPEG; `vite.config.mjs`). The blog plugin imports every relative photo with `?responsive`: photos in the Markdown get `srcset`/`sizes`/`width`/`height` from `app/content/photo.ts`, covers are rendered with `<ResponsiveImage>` and looked up in `app/content/covers.ts` (the `cover` export of the `?meta` module, kept out of the store), gallery photos are the `gallery` export of a post's HTML module, loaded by the post route (`app/content/gallery.ts`), and the RSS feed links the 960 px JPEGs, gallery included. The first build encodes every photo and is slow; later builds use the plugin's cache.
- `app/content/requests.ts` — the requests the routes make; `app/routes/*` await them so the prerender has the data.
- `site.mjs` — title, tagline and navigation, shared by the app and the build.
- Layout: from `lg` up the sidebar is fixed on the left (`app/templates/application.gts`); below it `app/components/mobile-nav.gts` shows a top bar whose menu opens the same Explore and TagFilter components in a Frontile Drawer (`frontile/overlays`, rendered into the `<PortalTarget>` at the end of the application template). Frontile's theme comes in through `app/styles/app.css` (`@import "@frontile/theme"`, its plugin, and `@source` lines for its classes in node_modules).
- The mobile menu button opens the drawer `{{on "click"}}`, not with Frontile's `@onPress`: that fires on `pointerup`, and the tap's click that follows lands on the new backdrop and closes the drawer (Frontile 0.18.10).
- PWA (`vite-plugin-pwa` in `vite.config.mjs`, build only, not in tests): the manifest, the icons generated from `public/favicon.svg` (`pwaAssets`, so no PNGs in the repo) with their `<link>`s injected into the head, and a Workbox service worker. It runs after the prerender (`closeBundleOrder: 'post'`) so it precaches every prerendered page; photos are cached at runtime, not precached.
- Prerendering is `vite-ember-ssr`'s `emberSsg` (`vite.config.mjs`); the route list comes from `lib/content.mjs`. `app/app-ssr.ts` is its entry, `app/entry.ts` rehydrates in the browser. The SSG plugin is limited to `vite build`: its `closeBundle` also runs when a dev server stops or restarts and would prerender over `dist/`. vite-ember-ssr only supports compatless apps: no `@embroider/compat`, no `ember-cli-build`, no classic addons.
- Styling: Tailwind utility classes in the `.gts` templates; post bodies use `@tailwindcss/typography` (`app/components/prose.gts`).
- `/changelog` is `CHANGELOG.md`, rendered by the same Markdown loader as the posts (`lib/vite-plugin-blog.mjs` lets it through besides `content/`) and loaded lazily by `app/routes/changelog.ts`, which drops its `# Changelog` for the template's h1. Keep the changelog in that Markdown: it is a page of the site. Versions are release dates, `## YYYY-MM-DD`, not semver: new entries go under `## Unreleased` at the top (add it when missing), renamed to the date when released. Several releases on one day are one version: merge into that day's section, never `2026-11-17.2` or the like.
- The About me page (`/page/about-me`) is not Markdown: its text, cards, timeline and links are data in `app/templates/about-me.gts`, rendered by `app/components/sections.gts` (cards / timeline / links, from Tailwind Plus). Text there is hand-written HTML.
- Licensing: code is MIT except the Transmit-derived layout files listed in `LICENSE` (Tailwind Plus licence, not ours to give away); content is CC BY-NC-SA 4.0. When a new component or template copies markup or styling from Transmit, add it to that list. Keep the README framing the repo as this site's source, not a reusable template.
- `netlify.toml` — CSP and other headers, GPX headers, redirects of old URLs.
