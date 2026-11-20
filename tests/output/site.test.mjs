// Checks the production build (pnpm build): every post and page
// was prerendered with its content, and the feed exists.
//
// Usage: pnpm build && pnpm test:output

import { createHash } from 'node:crypto';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { test } from 'node:test';
import assert from 'node:assert/strict';

import { readAll } from '../../lib/content.mjs';
import site from '../../site.mjs';

const root = join(import.meta.dirname, '../..');
const dist = join(root, 'dist');

const escape = (text) =>
  String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

function page(url) {
  const file = join(dist, url, 'index.html');

  assert.ok(existsSync(file), `${url} was not prerendered`);

  return readFileSync(file, 'utf8');
}

function titleOf(html) {
  return html.match(/<title>([^<]*)<\/title>/)?.[1];
}

const posts = readAll(root, 'posts');

test('the index lists every post', () => {
  const html = page('/');

  assert.equal(titleOf(html), escape(site.title));

  for (const post of posts) {
    assert.match(html, new RegExp(`data-test-post="${post.id}"`), post.id);
  }
});

for (const post of posts) {
  test(`post ${post.id}`, () => {
    const html = page(`/${post.id}`);

    assert.equal(titleOf(html), escape(`${post.title} - ${site.title}`));
    assert.match(html, /class="prose/);
    // Photos are resized (lib/vite-plugin-blog.mjs, app/content/photo.ts)
    assert.doesNotMatch(html, /<img[^>]*src="\.\//, 'unbundled photo');
    if (/<img[^>]*loading="lazy"/.test(html)) {
      assert.match(html, /srcset="[^"]*480w/, 'photos without srcset');
    }
    assert.match(html, /<meta property="og:title"/);

    // The facts: front matter, as a table before the story
    assert.equal(
      /data-test-facts/.test(html),
      post.facts !== undefined,
      'facts table',
    );

    // The learnings: front matter, as a checklist
    assert.equal(
      /data-test-learnings\b/.test(html),
      post.learnings !== undefined,
      'learnings checklist',
    );

    // The gallery: front matter, each photo a link to its largest JPEG
    // (1440 px, or less for a smaller original)
    const gallery = post.gallery ?? [];
    const links = html.match(/<a [^>]*data-test-gallery-photo[^>]*>/g) ?? [];

    assert.equal(links.length, gallery.length, 'gallery photos');
    for (const link of links) {
      assert.match(link, /href="\/assets\/[^"]+-\d+w-[^"]+\.jpg"/);
    }

    assert.doesNotMatch(html, /href="\/author\//, 'no author byline');
  });
}

test('drafts are left out', () => {
  const rss = readFileSync(join(dist, 'rss.xml'), 'utf8');

  for (const draft of readAll(root, 'posts', { drafts: true }).filter(
    (post) => post.published === false,
  )) {
    assert.ok(!existsSync(join(dist, draft.id)), `${draft.id} prerendered`);
    assert.ok(!rss.includes(`/${draft.id}<`), `${draft.id} in the feed`);
  }
});

test('old tag pages redirect to the filter', () => {
  assert.ok(!existsSync(join(dist, 'tag')), 'no tag pages');
  assert.match(
    readFileSync(join(root, 'netlify.toml'), 'utf8'),
    /from = "\/tag\/:id"\n\s*to = "\/\?tags=:id"/,
  );
});

test('page about-me', () => {
  const html = page('/page/about-me');

  assert.equal(titleOf(html), escape(`Michal Bryxí - ${site.title}`));
  assert.match(html, /data-test-section="Outdoors"/);
});

for (const { id, title } of readAll(root, 'pages')) {
  test(`page ${id}`, () => {
    assert.equal(
      titleOf(page(`/page/${id}`)),
      escape(`${title} - ${site.title}`),
    );
  });
}

test('the RSS feed has every post, with absolute image URLs', () => {
  const rss = readFileSync(join(dist, 'rss.xml'), 'utf8');

  for (const post of posts)
    assert.ok(rss.includes(`/${post.id}</link>`), post.id);

  assert.doesNotMatch(rss, /src="\.\//, 'relative image URLs in the feed');
  assert.doesNotMatch(rss, /__(ASSET|PHOTO)_\d+__/);
  assert.match(rss, /<enclosure url="https:\/\/[^"]+-960w-[^"]+\.jpg"/);
  // So are the facts tables
  assert.match(rss, /<th>Ascent<\/th><td>1,820 m<\/td>/);
  // Gallery photos are in the feed too
  assert.match(rss, /Photo gallery/);
});

test('the site installs as an app, with icons that exist', () => {
  const manifest = JSON.parse(
    readFileSync(join(dist, 'manifest.webmanifest'), 'utf8'),
  );

  assert.equal(manifest.name, site.title);
  assert.equal(manifest.display, 'standalone');
  assert.ok(manifest.icons.some((icon) => icon.purpose === 'maskable'));

  for (const icon of manifest.icons)
    assert.ok(existsSync(join(dist, icon.src)), icon.src);

  // Every page, not only the front page: a post can be the first one opened
  for (const html of [page('/'), page(`/${posts[0].id}`)]) {
    assert.match(html, /<link rel="manifest" href="\/manifest\.webmanifest">/);
    assert.match(
      html,
      /<link rel="apple-touch-icon" href="\/apple-touch-icon-180x180\.png">/,
    );
    assert.match(
      html,
      /<script id="vite-plugin-pwa:register-sw" src="\/registerSW\.js">/,
    );
  }

  assert.ok(existsSync(join(dist, 'apple-touch-icon-180x180.png')));
});

test('the service worker precaches every prerendered page', () => {
  const sw = readFileSync(join(dist, 'sw.js'), 'utf8');

  for (const post of posts)
    assert.ok(sw.includes(`url:"${post.id}/index.html"`), post.id);

  assert.doesNotMatch(sw, /\.woff2"/, 'precaches fonts the site does not use');
  assert.doesNotMatch(sw, /url:"gpx\//);
});

test('the CSP allows every inline script of the prerendered pages', () => {
  const csp = readFileSync(join(root, 'netlify.toml'), 'utf8').match(
    /Content-Security-Policy = "([^"]+)"/,
  )[1];
  const scriptSrc = csp.match(/script-src ([^;]+)/)[1];
  const pages = ['/', '/page/about-me', `/${posts[0].id}`];

  for (const url of pages) {
    const inline = [...page(url).matchAll(/<script>([^<]+)<\/script>/g)];

    // At least vite-ember-ssr's rehydration flag
    assert.ok(inline.length > 0, url);

    for (const [, code] of inline) {
      const hash = createHash('sha256').update(code).digest('base64');

      assert.ok(
        scriptSrc.includes(`'sha256-${hash}'`),
        `${url}: the CSP blocks <script>${code}</script>`,
      );
    }
  }
});

test('links to other posts, written as ../<id>/index.md, are post URLs', () => {
  assert.match(
    page('/2024-05-30-scott-kinabalu-ultra-rc'),
    /href="\/2023-10-05-run-for-love-5"/,
  );

  for (const post of posts)
    assert.doesNotMatch(page(`/${post.id}`), /href="[^"]*index\.md/, post.id);
});
