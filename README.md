# Adventuring Míša

The content of [adventuring-misa.pudr.com](https://adventuring-misa.pudr.com), Michal Bryxí's outdoor blog: trail running, T6 scrambles, Munros, paragliding and gear.

It's a [cowtent](https://github.com/vast-ch/cowtent-core) blog, started from [cowtent-starter](https://github.com/vast-ch/cowtent-starter): only Markdown, photos and settings live here, and cowtent builds them into the site. Netlify builds it on every commit (`netlify.toml`).

```
site.yaml                       title, colour, menu, theme
languages/en.yaml               names of the tags
cover.jpg                       the sidebar photo
posts/<date>-<slug>/index.md    a post at /<date>-<slug>
posts/<...>/cover - ….jpg       its cover: "cover - The alt text.jpg"
posts/<...>/gallery/            its gallery: "01 - The caption.jpg"
pages/about-me/index.md         the About me page at /page/about-me
```

```sh
pnpm install
pnpm start    # http://localhost:4200
pnpm build    # dist/, every page prerendered and checked
```

## Licence

The posts, pages, photos and route files are © Michal Bryxí, [CC BY-NC-SA 4.0](LICENSE.md). cowtent itself is MIT.
