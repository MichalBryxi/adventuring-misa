import type { ImageData } from '@responsive-image/core';

/**
 * The cover photos (`image: ./cover.jpg`), resized by
 * @responsive-image/vite-plugin. They stay out of the store: an image is
 * a set of URLs plus functions, not data to cache.
 */
const COVERS = {
  posts: import.meta.glob<ImageData | undefined>('/content/posts/*/index.md', {
    query: '?meta',
    import: 'cover',
    eager: true,
  }),
  pages: import.meta.glob<ImageData | undefined>('/content/pages/*/index.md', {
    query: '?meta',
    import: 'cover',
    eager: true,
  }),
};

export const postCover = (id: string) =>
  COVERS.posts[`/content/posts/${id}/index.md`];

export const pageCover = (id: string) =>
  COVERS.pages[`/content/pages/${id}/index.md`];
