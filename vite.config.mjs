import { responsiveImage } from '@responsive-image/vite-plugin';
import tailwindcss from '@tailwindcss/vite';
import { join } from 'node:path';

import { defineConfig } from 'vite';
import { extensions, ember } from '@embroider/vite';
import { babel } from '@rollup/plugin-babel';
import { emberSsg } from 'vite-ember-ssr/vite-plugin';
import { VitePWA } from 'vite-plugin-pwa';

import { listRoutes } from './lib/content.mjs';
import { blog } from './lib/vite-plugin-blog.mjs';
import site from './site.mjs';

// The test build runs in the browser only, nothing to prerender
const isTest = process.env.EMBER_ENV === 'test';

// The tests run against a few dummy posts that only change with the tests,
// not against the real ones. The app imports the Markdown as @content/…
const content = isTest ? 'tests/fixtures/content' : 'content';

// The app icons, from public/favicon.svg (the face on a white tile, so it
// doesn't disappear on a dark home screen or dock). The tile has its margin
// already: a little more keeps the face in a maskable icon's safe circle.
const icons = {
  transparent: { sizes: [64, 192, 512], favicons: [[48, 'favicon.ico']] },
  maskable: { sizes: [512], padding: 0.1 },
  apple: { sizes: [180], padding: 0.1 },
};

export default defineConfig({
  resolve: {
    alias: { '@content': join(import.meta.dirname, content) },
  },
  plugins: [
    blog({ site, content }),
    // Every photo imported with ?responsive, in the widths app/content/photo.ts expects
    responsiveImage({ w: [480, 960, 1440], format: ['webp', 'jpeg'] }),
    ember(),
    babel({
      babelHelpers: 'runtime',
      extensions,
    }),
    tailwindcss(),
    // Installable on a phone: the manifest, the icons with their <link>s in
    // the head, and a service worker that keeps the site readable offline
    !isTest &&
      VitePWA({
        registerType: 'autoUpdate',
        // After emberSsg's closeBundle, so that the prerendered pages are
        // there to precache
        integration: { closeBundleOrder: 'post' },
        pwaAssets: { preset: icons, overrideManifestIcons: true },
        manifest: {
          id: '/',
          name: site.title,
          short_name: 'Adventuring',
          description: site.description,
          lang: 'en',
          start_url: '/',
          scope: '/',
          display: 'standalone',
          background_color: '#ffffff',
          theme_color: '#ffffff',
        },
        workbox: {
          // The app and the prerendered pages (not the fonts of Frontile's
          // theme, which the site doesn't use); the photos only once seen,
          // there are hundreds of them in three widths
          globPatterns: ['**/*.{js,css,html,svg,ico,png}'],
          globIgnores: ['gpx/**'],
          // Every page is prerendered: a page that isn't is a 404, not the app
          navigateFallback: null,
          runtimeCaching: [
            {
              urlPattern: ({ request, sameOrigin }) =>
                sameOrigin && request.destination === 'image',
              handler: 'CacheFirst',
              options: {
                cacheName: 'photos',
                expiration: { maxEntries: 300 },
              },
            },
          ],
        },
      }),
    // Only in `vite build`: its closeBundle also runs when a dev server
    // stops or restarts, and would then prerender over dist/
    !isTest &&
      emberSsg({ routes: listRoutes(import.meta.dirname) }).map((plugin) => ({
        ...plugin,
        apply: 'build',
      })),
  ],
});
