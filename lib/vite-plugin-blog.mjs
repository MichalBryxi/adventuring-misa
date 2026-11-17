import { readFile } from 'node:fs/promises';
import { dirname, join, relative, sep } from 'node:path';

import { Feed } from 'feed';

import { idOf, isPublished, readAll, tagNames } from './content.mjs';
import { factsTable, readFacts } from './facts.mjs';
import { readGear, withGear } from './gear.mjs';
import {
  isAsset,
  isPhoto,
  readMeta,
  renderFeed,
  renderPage,
} from './markdown.mjs';

/**
 * Lets the app import the Markdown under content/:
 *
 *   content/posts/a/index.md?meta → the front matter and the excerpt
 *   content/posts/a/index.md      → the rendered HTML
 *
 * The two are separate so that the front page does not download every post.
 *
 * Files the Markdown points to with a relative path become imports, so Vite
 * fingerprints and copies them. Photos (`![](./01.jpg)`, `image: ./cover.jpg`)
 * are imported with `?responsive`: @responsive-image/vite-plugin resizes them,
 * `<img>`s in the HTML get a srcset (app/content/photo.ts), and the cover is
 * the module's `cover` export, for <ResponsiveImage>. A post's `gallery:`
 * photos are the `gallery` export of its HTML module, so they load with it.
 *
 * Drafts (`published: false`) are empty modules in a build, so neither their
 * text nor their photos end up in dist/.
 *
 * Also writes /rss.xml.
 */
export function blog({ site, content = 'content' }) {
  let root;
  let command;
  // content/posts/a/01.jpg → the reference of its 960px JPEG, for the feed
  const feedPhotos = new Map();

  function inContent(path) {
    return path.startsWith(join(root, content) + sep);
  }

  function isContent(path) {
    return path.endsWith('.md') && inContent(path);
  }

  return {
    name: 'blog',
    enforce: 'pre',

    configResolved(config) {
      root = config.root;
      command = config.command;
    },

    async load(id) {
      const [path, query] = id.split('?');

      if (!isContent(path)) return;

      this.addWatchFile(path);

      const source = await readFile(path, 'utf8');

      if (command === 'build' && !isPublished(readMeta(source), path)) {
        return {
          code:
            query === 'meta'
              ? 'export default null;\nexport const cover = undefined;'
              : "export default '';\nexport const gallery = [];",
          moduleType: 'js',
        };
      }

      const assets = [];
      const photos = [];
      const imports = () => [
        ...assets.map(
          (url, index) => `import asset${index} from ${JSON.stringify(url)};`,
        ),
        ...photos.map(
          (url, index) =>
            `import photo${index} from ${JSON.stringify(`${url}?responsive`)};`,
        ),
      ];

      if (query === 'meta') {
        const meta = { id: idOf(path), ...readMeta(source) };

        // Loaded with the post instead (app/content/gallery.ts)
        delete meta.gallery;

        if (meta.facts !== undefined) meta.facts = readFacts(meta.facts, path);
        if (meta.gear !== undefined) meta.gear = readGear(meta.gear, path);

        if (isPhoto(meta.image)) photos.push(meta.image);

        return {
          code: [
            ...imports(),
            `export default ${JSON.stringify(meta)};`,
            `export const cover = ${photos.length ? 'photo0' : 'undefined'};`,
          ].join('\n'),
          moduleType: 'js',
        };
      }

      // URLs are only known once Vite has bundled the files,
      // so the module swaps placeholders for the imports at runtime.
      const html = await renderPage(source, {
        resolveAsset: (url) => `__ASSET_${assets.push(url) - 1}__`,
        resolveImage: (url) => `__PHOTO_${photos.push(url) - 1}__`,
      });
      const gallery = galleryOf(readMeta(source), path).map(
        ({ src, caption }) =>
          `{ photo: photo${photos.push(src) - 1}, caption: ${JSON.stringify(caption ?? '')} }`,
      );

      return {
        code: [
          `import { photoAttributes } from '/app/content/photo.ts';`,
          ...imports(),
          `const assets = [${assets.map((_, index) => `asset${index}`).join(', ')}];`,
          `const photos = [${photos.map((_, index) => `photo${index}`).join(', ')}];`,
          `export default ${JSON.stringify(html)}`,
          `  .replace(/src="__PHOTO_(\\d+)__"/g, (_, index) => photoAttributes(photos[index]))`,
          `  .replace(/__ASSET_(\\d+)__/g, (_, index) => assets[index]);`,
          `export const gallery = [${gallery.join(', ')}];`,
        ].join('\n'),
        moduleType: 'js',
      };
    },

    // @responsive-image/vite-plugin emits the resized files; remember which
    // one the feed should use. Its URLs are only known in generateBundle.
    transform: {
      order: 'post',
      handler(code, id) {
        const [path, query] = id.split('?');

        if (query !== 'responsive' || !inContent(path)) return;

        const match = code.match(
          /"?url"?:\s*"__VITE_ASSET__([\w$-]+)__"\s*,\s*"?width"?:\s*960\s*,\s*"?format"?:\s*["']jpeg["']/,
        );

        if (match)
          feedPhotos.set(relative(root, path).split(sep).join('/'), match[1]);
      },
    },

    async generateBundle(_options, bundle) {
      if (this.environment.name !== 'client') return;

      // content/posts/a/route.gpx → assets/route-Bx3k.gpx
      // content/posts/a/01.jpg → assets/01-960w-Bx3k.jpg
      const emitted = new Map();

      for (const output of Object.values(bundle)) {
        for (const original of output.originalFileNames ?? []) {
          emitted.set(original, output.fileName);
        }
      }

      for (const [original, reference] of feedPhotos) {
        emitted.set(original, this.getFileName(reference));
      }

      this.emitFile({
        type: 'asset',
        fileName: 'rss.xml',
        source: await renderRss(root, content, site, emitted),
      });
    },
  };
}

async function renderRss(root, content, site, emitted) {
  const names = tagNames(root);
  const posts = readAll(root, 'posts', { content }).sort(
    (a, b) => new Date(b.date) - new Date(a.date),
  );

  const absolute = (post, url) => {
    const original = relative(root, join(dirname(post.path), url));
    const fileName = emitted.get(original.split(sep).join('/'));

    return fileName ? `${site.host}/${fileName}` : undefined;
  };

  const feed = new Feed({
    title: site.title,
    description: site.description,
    id: site.host,
    link: site.host,
    copyright: site.title,
    updated: new Date(posts.at(0).date),
    feedLinks: { rss: `${site.host}/rss.xml` },
  });

  for (const post of posts) {
    feed.addItem({
      title: post.title,
      link: `${site.host}/${post.id}`,
      date: new Date(post.date),
      description: post.excerpt,
      content:
        factsTable(readFacts(post.facts, post.path)) +
        withGear(
          await renderFeed(post.source, {
            resolveAsset: (url) => absolute(post, url),
          }),
          readGear(post.gear, post.path),
        ) +
        feedGallery(galleryOf(post, post.path), (url) => absolute(post, url)),
      category: (post.tags ?? []).map((tag) => ({
        name: names.get(tag) ?? tag,
      })),
      image: isAsset(post.image) ? absolute(post, post.image) : undefined,
    });
  }

  return feed.rss2();
}

/**
 * The `gallery:` front matter: a list of `{ src: ./photo.jpg, caption }`.
 */
function galleryOf(meta, path) {
  const gallery = meta.gallery ?? [];

  for (const entry of gallery) {
    if (!isPhoto(entry?.src)) {
      throw new Error(
        `${path}: gallery entries need a relative photo as src, got ${JSON.stringify(entry)}`,
      );
    }
  }

  return gallery;
}

function feedGallery(gallery, absolute) {
  const escape = (text) =>
    text.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
  const photos = gallery.flatMap(({ src, caption = '' }) => {
    const url = absolute(src);

    return url ? [`<p><img src="${url}" alt="${escape(caption)}"></p>`] : [];
  });

  return photos.length ? `<h2>Photo gallery</h2>${photos.join('')}` : '';
}
