import { responsiveImage } from '@responsive-image/vite-plugin';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vite';
import { extensions, ember } from '@embroider/vite';
import { babel } from '@rollup/plugin-babel';
import { emberSsg } from 'vite-ember-ssr/vite-plugin';

import { listRoutes } from './lib/content.mjs';
import { blog } from './lib/vite-plugin-blog.mjs';
import site from './site.mjs';

// The test build runs in the browser only, nothing to prerender
const isTest = process.env.EMBER_ENV === 'test';

export default defineConfig({
  plugins: [
    blog({ site }),
    // Every photo imported with ?responsive, in the widths app/content/photo.ts expects
    responsiveImage({ w: [480, 960, 1440], format: ['webp', 'jpeg'] }),
    ember(),
    babel({
      babelHelpers: 'runtime',
      extensions,
    }),
    tailwindcss(),
    // Only in `vite build`: its closeBundle also runs when a dev server
    // stops or restarts, and would then prerender over dist/
    !isTest &&
      emberSsg({ routes: listRoutes(import.meta.dirname) }).map((plugin) => ({
        ...plugin,
        apply: 'build',
      })),
  ],
});
