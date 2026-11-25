# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

"Adventuring Míša" - a personal outdoor blog (trail running, hiking, T6 scrambles, Munros, gear reviews) at https://adventuring-misa.pudr.com. It is a [cowtent](https://github.com/vast-ch/cowtent-core) blog, started from cowtent-starter: this repo holds only the content and the settings. The platform (Ember app, build, themes) is `cowtent-core` (`~/vast/cowtent-core`), installed from its `main` branch on every build: there's no lockfile and nothing is pinned. A change the blog needs from the platform goes into cowtent-core, never here.

Netlify builds and hosts it. Its build files (`package.json` scripts, `netlify.toml`, `.node-version`, `.gitignore`) are the starter's, as in a fresh fork: change them in cowtent-starter, not here. `pnpm build` runs `pnpm update cowtent-core && cowtent build`, which prerenders every page and fails if a post, page, photo or link didn't make it. The site's address comes from Netlify (its `URL`), so site.yaml has no `url:`.

## Commands

Node 24 + pnpm 10 (`.node-version`).

- `pnpm start` - dev server on http://localhost:4200, content edits reload live
- `pnpm build` - the site in `dist/`, checked
- With a change in a local cowtent-core, run it from the core instead: `BLOG_CONTENT=~/pudr.com/adventuring-misa node bin/cowtent.mjs start` in `~/vast/cowtent-core`

## Content

- `site.yaml` - title, description, colour, menu, theme. `languages/en.yaml` - the names of the tags that don't read right as their words, and any of cowtent's words reworded.
- `posts/<date>-<slug>/index.md` - a post at `/<date>-<slug>`. Its inline photos and its GPX sit next to it and are referenced relatively (`![…](./01.png)`). The cover is the photo next to it named `cover - <alt text>.jpg` (any case, jpg/png/webp/avif, one per folder), no front matter for it. Cross-links to other posts are files, `../2021-06-07-an-teallach/index.md`, so they also work in Obsidian; from a page, `../../posts/<id>/index.md`.
- The gallery is the post's cover, then the `gallery/` folder of a post: every photo in it, the file name is the caption (and the alt text), a leading number and ` - ` the order: `gallery/01 - Looking back at the serac.jpg`. No `?` or `#` in the names. Keep a photo inline in the text only when the text refers to it where it is (the Windy, Suunto and Magic Pass posts).
- A route: the GPX next to the post named exactly `route.gpx`, nothing to write in the text: the route on swisstopo's map above the gallery (MapLibre: it opens big, tilts into 3D on swisstopo's terrain, and a full-screen photo with GPS has "Show on the map"), its download link in the facts. The `facts.points` with `latitude`/`longitude` get a pin on it, and every gallery photo (the cover too) with GPS in its EXIF a small photo on a pin, its tip where the photo was taken, that opens it in the gallery. No `## The route` section and no `![…](./route.gpx)` embed in the text.
- Photos keep their GPS: export without `-strip` (`magick in.jpg -auto-orient -resize '2000x2000>' +profile 'xmp,iptc,8bim' -quality 82 out.jpg`). The site serves photos made anew without EXIF, so the GPS stays in the repo's files only.
- Numbers about the trip go in `facts:` (date, location, grade, rating 1-5, points as `{ name, altitude, link, latitude, longitude }` in order, distance in km, ascent in m, duration/movingTime as h:mm[:ss], free-form `more:` rows and `links:`). The table is rendered before the story; don't write facts tables or Stats lists in the text. Rating, ascent, distance, time and gradient become the sidebar filters by themselves.
- What I did right and wrong is a checklist in the text, usually a `## Learnings` section after the story: `- [+] **What went well**` / `- [-] **What didn't**`, with the reason on the next line indented by two spaces.
- Tags are dasherised ids, optionally in one group: `munro`, `fun/type-3`, `t-grade/t6`, `country/scotland`. The rating is not a tag, it's `facts.rating`.
- `published: false` is a draft: `pnpm start` shows it, the build leaves it out.
- `pages/about-me/index.md` - the About me page (`/page/about-me`), its photo `cover - ….jpg` next to it. `cover.jpg` at the root - the sidebar photo.
- The Obsidian vault (`~/Library/Mobile Documents/iCloud~md~obsidian/Documents/Míša`) has no copy of the posts, only a fact note per trip, race or piece of gear, with a `Blog:` property and a `## Blog` section linking to the post on the web. A new post gets such a note (or the existing one gets the `Blog` link).

Markdown is not prettier-formatted.

Never use an em dash or en dash anywhere (content, settings, docs, titles): write a plain minus `-` instead.

## Netlify

Netlify builds on every push to main, so check changes locally first (a production build, `node ~/vast.ch/cowtent-core/bin/cowtent.mjs build`, with its `dist` served locally) and push only to release, everything pending at once.

`netlify.toml` is only the build command and folder. The Content-Security-Policy (a `<meta>` in every page) and the headers (`dist/_headers`: assets cached forever, CORS for swisstopo's GPX) come with cowtent-core's build (its `lib/host.mjs`).
