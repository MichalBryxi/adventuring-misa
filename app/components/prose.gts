import { htmlSafe } from '@ember/template';

import type { TOC } from '@ember/component/template-only';

/**
 * Markdown rendered at build time (lib/markdown.mjs), styled by
 * @tailwindcss/typography. The h2 markers are the Transmit "show notes" look.
 */
export const Prose: TOC<{ Element: HTMLDivElement; Args: { html: string } }> =
  <template>
    <div
      class="prose max-w-none prose-slate prose-headings:scroll-mt-8 prose-a:text-emerald-700 hover:prose-a:text-emerald-900 prose-table:text-sm prose-img:rounded-xl prose-img:shadow-lg prose-img:shadow-slate-200 [&_iframe]:rounded-xl [&>h2]:mt-12 [&>h2]:flex [&>h2]:items-center [&>h2]:font-mono [&>h2]:text-sm/7 [&>h2]:font-medium [&>h2]:text-slate-900 [&>h2]:before:mr-3 [&>h2]:before:h-3 [&>h2]:before:w-1.5 [&>h2]:before:rounded-r-full [&>h2]:before:bg-emerald-200 [&>h2:nth-of-type(3n)]:before:bg-sky-200 [&>h2:nth-of-type(3n+2)]:before:bg-amber-200"
      ...attributes
    >
      {{htmlSafe @html}}
    </div>
  </template>;
