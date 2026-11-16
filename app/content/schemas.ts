import { withDefaults } from '@warp-drive/core/reactive';

import type { Type } from '@warp-drive/core/types/symbols';

/**
 * The front matter of the Markdown files, as WarpDrive resources.
 *
 * Any front-matter key not listed here is still in the cache,
 * it just needs a field to be read.
 */

const toMany = (name: string, type: string) => ({
  kind: 'hasMany' as const,
  name,
  type,
  options: { async: false as const, inverse: null, linksMode: true as const },
});

export const PostSchema = withDefaults({
  type: 'post',
  fields: [
    { kind: 'field', name: 'title' },
    { kind: 'field', name: 'date' },
    { kind: 'field', name: 'excerpt' },
    { kind: 'field', name: 'image' },
    { kind: 'field', name: 'imageMeta' },
    { kind: 'field', name: 'featured' },
    // Only loaded with the single post, the list pages don't need it
    { kind: 'field', name: 'html' },
    toMany('tags', 'tag'),
    toMany('authors', 'author'),
  ],
});

export const PageSchema = withDefaults({
  type: 'page',
  fields: [
    { kind: 'field', name: 'title' },
    { kind: 'field', name: 'image' },
    { kind: 'field', name: 'html' },
  ],
});

export const TagSchema = withDefaults({
  type: 'tag',
  fields: [
    { kind: 'field', name: 'name' },
    { kind: 'field', name: 'excerpt' },
  ],
});

export const AuthorSchema = withDefaults({
  type: 'author',
  fields: [
    { kind: 'field', name: 'name' },
    { kind: 'field', name: 'image' },
    { kind: 'field', name: 'website' },
    { kind: 'field', name: 'location' },
    { kind: 'field', name: 'excerpt' },
  ],
});

export const schemas = [PostSchema, PageSchema, TagSchema, AuthorSchema];

export interface Tag {
  [Type]: 'tag';
  id: string;
  name: string;
  excerpt: string;
}

export interface Author {
  [Type]: 'author';
  id: string;
  name: string;
  image?: string;
  website?: string;
  location?: string;
  excerpt: string;
}

export interface Post {
  [Type]: 'post';
  id: string;
  title: string;
  date: string;
  excerpt: string;
  image?: string;
  imageMeta?: { attribution?: string; attributionLink?: string };
  featured?: boolean;
  html?: string;
  tags: Tag[];
  authors: Author[];
}

export interface Page {
  [Type]: 'page';
  id: string;
  title: string;
  image?: string;
  html?: string;
}
