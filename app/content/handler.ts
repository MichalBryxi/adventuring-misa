import type { Handler, NextFn } from '@warp-drive/core/request';
import type { RequestContext } from '@warp-drive/core/types/request';

import { schemas } from './schemas.ts';

/**
 * Answers the store's requests from the Markdown under content/,
 * which the build turns into modules (see lib/vite-plugin-blog.mjs).
 *
 *   GET /posts                 all posts, newest first
 *   GET /posts?tag=munro       posts with a tag
 *   GET /posts?tag=a&tag=b     posts with all of the tags
 *   GET /posts/<id>            one post, with its HTML
 *   GET /pages/<id>            one page, with its HTML
 *   GET /tags/<id>
 *
 * The front matter of every file is bundled; the HTML of a post or page
 * is a separate chunk, loaded when that post is opened.
 */

type Meta = { id: string; [key: string]: unknown };
type Loader = () => Promise<string>;

// Vite reads the glob options statically: they have to be written out each time
const META = {
  posts: import.meta.glob<Meta>('/content/posts/*/index.md', {
    query: '?meta',
    import: 'default',
    eager: true,
  }),
  pages: import.meta.glob<Meta>('/content/pages/*/index.md', {
    query: '?meta',
    import: 'default',
    eager: true,
  }),
  tags: import.meta.glob<Meta>('/content/tags/*.md', {
    query: '?meta',
    import: 'default',
    eager: true,
  }),
};

const HTML: Partial<Record<keyof typeof META, Record<string, Loader>>> = {
  posts: import.meta.glob<string>('/content/posts/*/index.md', {
    import: 'default',
  }),
  pages: import.meta.glob<string>('/content/pages/*/index.md', {
    import: 'default',
  }),
};

const TYPES = {
  posts: 'post',
  pages: 'page',
  tags: 'tag',
} as const;

type Collection = keyof typeof META;

const byId = (collection: Collection) =>
  new Map(
    Object.entries(META[collection]).map(([path, meta]) => [
      meta.id,
      { path, meta },
    ]),
  );

const INDEX = {
  posts: byId('posts'),
  pages: byId('pages'),
  tags: byId('tags'),
};

const POSTS = [...INDEX.posts.values()]
  .map(({ meta }) => meta)
  .sort((a, b) => String(b.date).localeCompare(String(a.date)));

function relationship(type: string, ids: unknown, from: string) {
  return {
    data: ((ids as string[] | undefined) ?? []).map((id) => ({ type, id })),
    links: { related: from },
  };
}

/**
 * The attributes each type declares in its schema. Front-matter keys
 * without a field stay in the Markdown until something needs them.
 */
const ATTRIBUTES = new Map(
  schemas.map((schema) => [
    schema.type,
    schema.fields
      .filter((field) => field.kind === 'field')
      .map((field) => field.name),
  ]),
);

function resource(collection: Collection, meta: Meta, html?: string) {
  const type = TYPES[collection];
  const values: Record<string, unknown> = { ...meta, html };
  const attributes = Object.fromEntries(
    (ATTRIBUTES.get(type) ?? [])
      .filter((name) => values[name] !== undefined)
      .map((name) => [name, values[name]]),
  );

  return {
    type,
    id: meta.id,
    attributes,
    ...(collection === 'posts' && {
      relationships: {
        tags: relationship('tag', meta.tags, `/posts/${meta.id}/tags`),
      },
    }),
  };
}

/**
 * The tags of the posts in a response.
 */
function included(posts: Meta[]) {
  const ids = new Set(
    posts.flatMap((post) => (post.tags as string[] | undefined) ?? []),
  );

  return [...ids].flatMap((id) => {
    const entry = INDEX.tags.get(id);
    return entry ? [resource('tags', entry.meta)] : [];
  });
}

class NotFoundError extends Error {
  status = 404;
}

async function findOne(collection: Collection, id: string) {
  const entry = INDEX[collection].get(id);

  if (!entry) throw new NotFoundError(`No ${TYPES[collection]} "${id}"`);

  const html = await HTML[collection]?.[entry.path]?.();

  return {
    data: resource(collection, entry.meta, html),
    included: collection === 'posts' ? included([entry.meta]) : [],
  };
}

function findPosts(filters: URLSearchParams) {
  const tags = filters.getAll('tag');

  const posts = POSTS.filter((post) =>
    tags.every((tag) => (post.tags as string[] | undefined)?.includes(tag)),
  );

  return {
    data: posts.map((post) => resource('posts', post)),
    included: included(posts),
  };
}

export const ContentHandler: Handler = {
  request<T>(context: RequestContext, next: NextFn<T>) {
    const { url } = context.request;
    const { pathname, searchParams } = new URL(url ?? '', 'content:/');
    const [collection, id] = pathname.split('/').filter(Boolean) as [
      string,
      string?,
    ];

    if (!(collection in META)) return next(context.request);

    if (id) return findOne(collection as Collection, id) as Promise<T>;
    if (collection === 'posts')
      return Promise.resolve(findPosts(searchParams) as T);

    return next(context.request);
  },
};
