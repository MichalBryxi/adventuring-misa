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

- **Code**: [MIT](LICENSE).
- **Content** (posts, pages, photos in `content/`, routes in `public/gpx/`): © Michal Bryxí, [CC BY-NC-SA 4.0](content/LICENSE.md).
- **Design**: the layout is derived from [Transmit](https://tailwindcss.com/plus/templates/transmit), a [Tailwind Plus](https://tailwindcss.com/plus) template, used here under the [Tailwind Plus licence](https://tailwindcss.com/plus/license). That licence doesn't allow re-distributing the template or its derivatives on their own, so please don't extract the layout as a theme for your own site.
