import type { ImageData } from '@responsive-image/core';

export interface GalleryPhoto {
  photo: ImageData;
  caption: string;
}

/**
 * A post's `gallery:` photos, resized by @responsive-image/vite-plugin.
 * They are an export of the post's HTML module, so they load with it,
 * and stay out of the store like the covers (app/content/covers.ts).
 */
const GALLERIES = import.meta.glob<GalleryPhoto[]>(
  '/content/posts/*/index.md',
  {
    import: 'gallery',
  },
);

export async function galleryOf(id: string): Promise<GalleryPhoto[]> {
  return (await GALLERIES[`/content/posts/${id}/index.md`]?.()) ?? [];
}
