# Adventuring Míša

A personal outdoor blog. Ember 7 (compatless, Vite), WarpDrive, Tailwind CSS 4, prerendered to static HTML with [vite-ember-ssr](https://github.com/evoactivity/vite-ember-ssr).

```sh
pnpm install
pnpm start          # http://localhost:4200
pnpm build          # dist/, every page prerendered
pnpm test:output    # check the prerendered dist/
pnpm test           # acceptance tests in headless Chrome
```

Write a post: create `content/posts/YYYY-MM-DD-slug/index.md`, put its photos next to it, and reference them as `./photo.jpg`. See [CLAUDE.md](CLAUDE.md) for how it all fits together.
