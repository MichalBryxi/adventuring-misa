import { globSync, readFileSync } from 'node:fs';
import { basename, dirname, join } from 'node:path';

import { readMeta } from './markdown.mjs';

/**
 * Everything the site shows is Markdown under content/ (tests/fixtures/content/
 * in the test build, vite.config.mjs):
 *
 *   content/posts/<id>/index.md    a post, with its photos next to it
 *   content/pages/<id>/index.md    a standalone page (about me…)
 *
 * The id is the folder name (or the file name), and is the URL slug.
 *
 * A file with `published: false` is a draft: the dev server shows it while
 * I write it, the build leaves it out (lib/vite-plugin-blog.mjs).
 */
export const COLLECTIONS = {
  posts: 'posts/*/index.md',
  pages: 'pages/*/index.md',
};

export function idOf(path) {
  const name = basename(path, '.md');

  return name === 'index' ? basename(dirname(path)) : name;
}

export function isPublished(meta, path) {
  if (meta.published === undefined) return true;
  if (typeof meta.published !== 'boolean') {
    throw new Error(`${path}: published must be true or false`);
  }

  return meta.published;
}

/**
 * The published files of a collection, or all of them with `drafts`.
 */
export function readAll(
  root,
  collection,
  { content = 'content', drafts = false } = {},
) {
  const dir = join(root, content);

  return globSync(COLLECTIONS[collection], { cwd: dir })
    .map((path) => {
      const source = readFileSync(join(dir, path), 'utf8');

      return {
        id: idOf(path),
        path: join(dir, path),
        source,
        ...readMeta(source),
      };
    })
    .filter((entry) => drafts || isPublished(entry, entry.path));
}

/**
 * The English names of the tags (translations/en-us.json), keyed by tag id.
 */
export function tagNames(root) {
  const translations = JSON.parse(
    readFileSync(join(root, 'translations/en-us.json'), 'utf8'),
  );

  return new Map(
    Object.entries(translations)
      .filter(([key]) => key.startsWith('tag.'))
      .map(([key, name]) => [key.slice('tag.'.length), name]),
  );
}

/**
 * A tag without a translation has no name to show, and is probably a typo.
 * A tag in a group (rating/4-stars) needs its group named too.
 */
function assertTagsExist(root, posts) {
  const names = tagNames(root);

  for (const post of posts) {
    for (const tag of post.tags ?? []) {
      for (const id of [
        tag,
        ...(tag.includes('/') ? [tag.split('/')[0]] : []),
      ]) {
        if (!names.has(id)) {
          throw new Error(
            `${post.id} uses the tag "${tag}", but translations/en-us.json has no "tag.${id}"`,
          );
        }
      }
    }
  }
}

/**
 * Every URL that gets a prerendered HTML file, without the leading slash
 * (the format vite-ember-ssr expects).
 */
export function listRoutes(root) {
  const posts = readAll(root, 'posts');

  assertTagsExist(root, posts);

  return [
    'index',
    ...posts.map((post) => post.id),
    // app/templates/about-me.gts
    'page/about-me',
    // app/routes/changelog.ts
    'changelog',
    ...readAll(root, 'pages').map((page) => `page/${page.id}`),
  ];
}
