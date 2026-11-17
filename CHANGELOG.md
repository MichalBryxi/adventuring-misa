# Changelog

## 2026-11-17

### Added

- "Send me a note" under every post instead of comments: it opens your email app with a note to me, the article's title and link already in it.
- "All adventures" as the first link under Explore: the front page with every post, the filter cleared.
- About me page built from data in `app/templates/about-me.gts`: cards for Outdoors and Computers, a timeline of courses and certificates, talks, and links to find me elsewhere.
- About me content: what I do outdoors, courses and certificates, my projects (beauty-pay.cz, winds.mobi, Forkcast, Magic Pass on the map, paragliding flight stats, this blog), my EmberFest 2026 talk, and Strava, Mastodon, GitHub, LinkedIn and my outdoor CV.
- "Written by" in the sidebar and footer links to the About me page.
- Tag cloud in the sidebar under its own Tags heading: each tag in its own colour, sized by how many posts use it, the biggest in the middle (star ratings left out).
- Tags filter the front page: click tags in the sidebar to add or remove them, and `/?tags=…` lists the posts that have all of them, with the filter shown above the list.
- Tags can be in a group, written `group/tag` like Obsidian's nested tags (`rating/4-stars`, `t-grade/t6`); the sidebar shows each group under its name. The star ratings are under Rating, and SAC hiking grades under T-grade (Katzenwegli is T6).
- Tag names come from translations (ember-intl, `translations/en-us.json`), ready for more languages; English only so far.
- Facts table before the story, from a post's `facts:` front matter: date, location, grade (SAC grades link to the scale), points on the way with altitudes, distance, ascent, duration or moving time, free-form rows and links. The values are typed, so posts can be filtered by them.
- Gear checklist after the story, from a post's `gear:` front matter: what I had, what I didn't, and why it mattered.
- Photo gallery at the end of a post, from its `gallery:` front matter, as a masonry grid with a lightbox.
- Responsive images: 480, 960 and 1440 px, in WebP and JPEG.
- RSS feed with the facts, gear and gallery of each post.
- Every page prerendered to static HTML.
- Changelog page at `/changelog`, linked under Explore: this file, rendered with the posts' Markdown pipeline.
- Installable as an app on Android, iOS and desktop (vite-plugin-pwa): a web app manifest, home screen icons, and a service worker that keeps every page readable offline and the photos once seen.

### Changed

- The round photo in the phone's top bar is zoomed in on my face.
- "Trail Running" in the tagline is just "Running".
- On phones and tablets the sidebar is a menu: a slim bar at the top with a menu button opens the links and tags in a drawer from the left (Frontile). Tags picked there keep it open, and its button shows how many adventures match; the menu button shows how many filters are on.
- The favicon has a white tile behind the face, so it shows in dark browser tabs and on dark home screens.
- Rebuilt from sportsting-misa.pudr.com (empress-blog) as a compatless Ember 7 app on Vite, with WarpDrive and Tailwind CSS, keeping the old post URLs.
- Layout adapted from the Tailwind Plus "Transmit" template.
- h2 headings stand out more from h3.
- Facts and stats moved out of the post text into front matter; Katzenwegli's gear, start and destination, and SAC route moved into the gear checklist, points and links.

### Fixed

- On the live site the page didn't react to taps or clicks: the Content Security Policy blocked the small script that tells the app to take over the prerendered page, so it drew a second copy of the page below instead.

### Removed

- Tag pages and the tag files (`content/tags/`): tags filter the front page instead, and old `/tag/<id>` links redirect to the filter. The unused tag New is gone.
- Authors: posts aren't signed, and there are no author pages. Old `/author/…` links redirect to the front page.
