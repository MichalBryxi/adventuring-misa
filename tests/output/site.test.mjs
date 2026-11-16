// Checks the production build (pnpm build): every post and page
// was prerendered with its content, and the feed exists.
//
// Usage: pnpm build && pnpm test:output

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

    assert.equal(titleOf(html), escape(`${post.title} – ${site.title}`));
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

    // The gear: front matter, as a checklist
    assert.equal(
      /data-test-gear\b/.test(html),
      post.gear !== undefined,
      'gear checklist',
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

test('old tag pages redirect to the filter', () => {
  assert.ok(!existsSync(join(dist, 'tag')), 'no tag pages');
  assert.match(
    readFileSync(join(root, 'netlify.toml'), 'utf8'),
    /from = "\/tag\/:id"\n\s*to = "\/\?tags=:id"/,
  );
});

test('page about-me', () => {
  const html = page('/page/about-me');

  assert.equal(titleOf(html), escape(`Michal Bryxí – ${site.title}`));
  assert.match(html, /data-test-section="Outdoors"/);
});

for (const { id, title } of readAll(root, 'pages')) {
  test(`page ${id}`, () => {
    assert.equal(
      titleOf(page(`/page/${id}`)),
      escape(`${title} – ${site.title}`),
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
