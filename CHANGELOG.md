# Changelog

What changed on [Adventuring Míša](https://adventuring-misa.pudr.com), newest first. The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

## Unreleased

### Added

- About me page built from data in `app/templates/about-me.gts`: cards for Outdoors and Computers, a timeline of courses and certificates, talks, and links to find me elsewhere.
- About me content: what I do outdoors, courses and certificates, my projects (beauty-pay.cz, winds.mobi, Forkcast, Magic Pass on the map, paragliding flight stats, this blog), my EmberFest 2026 talk, and Strava, Mastodon, GitHub, LinkedIn and my outdoor CV.
- "Written by" in the sidebar and footer links to the About me page.
- Facts table before the story, from a post's `facts:` front matter: date, location, grade (SAC grades link to the scale), points on the way with altitudes, distance, ascent, duration or moving time, free-form rows and links. The values are typed, so posts can be filtered by them.
- Gear checklist after the story, from a post's `gear:` front matter: what I had, what I didn't, and why it mattered.
- Photo gallery at the end of a post, from its `gallery:` front matter, as a masonry grid with a lightbox.
- Responsive images: 480, 960 and 1440 px, in WebP and JPEG.
- RSS feed with the facts, gear and gallery of each post.
- Every page prerendered to static HTML.

### Changed

- Rebuilt from sportsting-misa.pudr.com (empress-blog) as a compatless Ember 7 app on Vite, with WarpDrive and Tailwind CSS, keeping the old post URLs.
- Layout adapted from the Tailwind Plus "Transmit" template.
- h2 headings stand out more from h3.
- Facts and stats moved out of the post text into front matter; Katzenwegli's gear, start and destination, and SAC route moved into the gear checklist, points and links.

### Removed

- Authors: posts aren't signed, and there are no author pages. Old `/author/…` links redirect to the front page.
