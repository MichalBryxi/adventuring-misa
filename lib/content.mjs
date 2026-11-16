import { globSync, readFileSync } from 'node:fs';
import { basename, dirname, join } from 'node:path';

import { readMeta } from './markdown.mjs';

/**
 * Everything the site shows is Markdown under content/:
 *
 *   content/posts/<id>/index.md    a post, with its photos next to it
 *   content/pages/<id>/index.md    a standalone page (about me…)
 *   content/tags/<id>.md
 *
 * The id is the folder name (or the file name), and is the URL slug.
 */
export const COLLECTIONS = {
  posts: 'content/posts/*/index.md',
  pages: 'content/pages/*/index.md',
  tags: 'content/tags/*.md',
};

export function idOf(path) {
  const name = basename(path, '.md');

  return name === 'index' ? basename(dirname(path)) : name;
}

export function readAll(root, collection) {
  return globSync(COLLECTIONS[collection], { cwd: root }).map((path) => {
    const source = readFileSync(join(root, path), 'utf8');

    return {
      id: idOf(path),
      path: join(root, path),
      source,
      ...readMeta(source),
    };
  });
}

/**
 * A tag without a file has no name to show.
 */
function assertTagsExist(root, posts) {
  const known = new Set(readAll(root, 'tags').map((tag) => tag.id));

  for (const post of posts) {
    for (const tag of post.tags ?? []) {
      if (!known.has(tag)) {
        throw new Error(
          `${post.id} uses the tag "${tag}", but content/tags/${tag}.md does not exist`,
        );
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
    ...readAll(root, 'pages').map((page) => `page/${page.id}`),
    ...new Set(
      posts.flatMap((post) => post.tags ?? []).map((tag) => `tag/${tag}`),
    ),
  ];
}
