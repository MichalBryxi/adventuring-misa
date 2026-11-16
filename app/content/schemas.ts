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
    // Typed for filtering, plus the rows to show (lib/facts.mjs)
    { kind: 'field', name: 'facts' },
    // What I had with me, and what I missed (lib/gear.mjs)
    { kind: 'field', name: 'gear' },
    // Only loaded with the single post, the list pages don't need it
    { kind: 'field', name: 'html' },
    toMany('tags', 'tag'),
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
  fields: [{ kind: 'field', name: 'name' }],
});

export const schemas = [PostSchema, PageSchema, TagSchema];

export interface Tag {
  [Type]: 'tag';
  id: string;
  name: string;
}

/**
 * The `facts:` front matter, read at build time by lib/facts.mjs.
 */
export interface Facts {
  date?: string;
  grade?: string;
  /** Places on the way, in order; altitude in m */
  points?: { name: string; altitude?: number; link?: string }[];
  /** km */
  distance?: number;
  /** m */
  ascent?: number;
  /** h:mm or h:mm:ss */
  duration?: string;
  movingTime?: string;
  /** The table to show: labels are text, values HTML */
  rows: { label: string; html: string }[];
}

/**
 * One line of the `gear:` front matter, read at build time by lib/gear.mjs.
 */
export interface GearItem {
  item: string;
  packed: boolean;
  /** Why it mattered, as HTML */
  note?: string;
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
  facts?: Facts;
  gear?: GearItem[];
  html?: string;
  tags: Tag[];
}

export interface Page {
  [Type]: 'page';
  id: string;
  title: string;
  image?: string;
  html?: string;
}
