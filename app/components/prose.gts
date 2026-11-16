import { htmlSafe } from '@ember/template';

import type { TOC } from '@ember/component/template-only';

/**
 * Markdown rendered at build time (lib/markdown.mjs), styled by
 * @tailwindcss/typography. The h2s are section headings (app/styles/app.css), with a marker colour cycling like Transmit's show notes.
 */
export const Prose: TOC<{ Element: HTMLDivElement; Args: { html: string } }> =
  <template>
    <div
      class="prose max-w-none prose-slate prose-headings:scroll-mt-8 prose-a:text-emerald-700 hover:prose-a:text-emerald-900 prose-table:text-sm prose-img:rounded-xl prose-img:shadow-lg prose-img:shadow-slate-200 [&_iframe]:rounded-xl [&>h2]:mt-14 [&>h2]:section-heading [&>h2]:mb-6 [&>h2]:before:bg-emerald-300 [&>h2:nth-of-type(3n)]:before:bg-sky-300 [&>h2:nth-of-type(3n+2)]:before:bg-amber-300"
      ...attributes
    >
      {{htmlSafe @html}}
    </div>
  </template>;
