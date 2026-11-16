# Adventuring Míša

The source of [adventuring-misa.pudr.com](https://adventuring-misa.pudr.com), a personal outdoor blog: trail running, T6 scrambles, Munros, paragliding and gear.

Built with Ember 7 (compatless, Vite), WarpDrive and Tailwind CSS 4, prerendered to static HTML with [vite-ember-ssr](https://github.com/evoactivity/vite-ember-ssr).

```sh
pnpm install
pnpm start          # http://localhost:4200
pnpm build          # dist/, every page prerendered
pnpm test:output    # check the prerendered dist/
pnpm test           # acceptance tests in headless Chrome
```

Write a post: create `content/posts/YYYY-MM-DD-slug/index.md`, put its photos next to it, and reference them as `./photo.jpg`. See [CLAUDE.md](CLAUDE.md) for how it all fits together.

## Licence

This is the source of my own website, not a blog template or theme to build yours from.

- **Code**: [MIT](LICENSE), except the layout files listed in [`LICENSE`](LICENSE).
- **Design**: the layout (`app/templates/` and a few components) is derived from [Transmit](https://tailwindcss.com/plus/templates/transmit), a [Tailwind Plus](https://tailwindcss.com/plus) template. Tailwind Labs Inc. owns its copyright, and it is used here under the [Tailwind Plus licence](https://tailwindcss.com/plus/license), which covers this site only. Those files are not MIT licensed: please don't copy them for your own site.
- **Content** (posts, pages, photos in `content/`, routes in `public/gpx/`): © Michal Bryxí, [CC BY-NC-SA 4.0](content/LICENSE.md).
