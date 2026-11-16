import { htmlSafe } from '@ember/template';

import type { TOC } from '@ember/component/template-only';

export interface Section {
  title: string;
  layout: 'cards' | 'timeline' | 'links';
  items: SectionItem[];
}

export interface SectionItem {
  heading: string;
  icon?: string;
  /** YYYY or YYYY-MM */
  date?: string;
  link?: string;
  /** HTML; written by hand, so trusted */
  text?: string;
}

// Derived from Tailwind Plus (the "Card with header" card and the "Simple
// with icons" feed), so not covered by the MIT licence.

const ACCENTS = [
  'before:bg-emerald-300',
  'before:bg-sky-300',
  'before:bg-amber-300',
  'before:bg-rose-300',
  'before:bg-violet-300',
];

const accent = (index: number) => ACCENTS[index % ACCENTS.length];
const eq = (a: unknown, b: unknown) => a === b;
const isLast = (index: number, list: unknown[]) => index === list.length - 1;
const html = (text: string) => htmlSafe(text);

// 2024-02 → Feb 2024
const formatDate = (date: string) => {
  const [year, month] = date.split('-');

  return month === undefined
    ? year
    : new Date(Date.UTC(Number(year), Number(month) - 1)).toLocaleDateString(
        'en-GB',
        { month: 'short', year: 'numeric', timeZone: 'UTC' },
      );
};

const LINK =
  '[&_a]:text-emerald-700 [&_a]:underline hover:[&_a]:text-emerald-900';

/**
 * Blocks of cards, a timeline or a row of links, each under its own heading
 * (the About me page).
 */
export const Sections: TOC<{
  Element: HTMLDivElement;
  Args: { sections: Section[] };
}> = <template>
  <div class="space-y-16" ...attributes>
    {{#each @sections as |block index|}}
      <section data-test-section={{block.title}}>
        <h2 class="section-heading {{accent index}}">{{block.title}}</h2>

        {{#if (eq block.layout "cards")}}
          <ul class="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2" role="list">
            {{#each block.items as |item|}}
              <li
                class="divide-y divide-slate-200 overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-slate-900/5"
                data-test-card={{item.heading}}
              >
                <div class="flex items-center gap-3 px-4 py-4 sm:px-5">
                  {{#if item.icon}}
                    <span
                      class="flex size-9 shrink-0 items-center justify-center rounded-lg bg-slate-50 text-xl ring-1 ring-slate-900/5"
                      aria-hidden="true"
                    >{{item.icon}}</span>
                  {{/if}}
                  <h3 class="font-semibold text-slate-900">
                    {{#if item.link}}
                      <a href={{item.link}} class="hover:text-emerald-700">
                        {{item.heading}}
                      </a>
                    {{else}}
                      {{item.heading}}
                    {{/if}}
                  </h3>
                </div>
                {{#if item.text}}
                  <p
                    class="px-4 py-4 text-sm/6 text-slate-600 sm:px-5 {{LINK}}"
                  >
                    {{html item.text}}
                  </p>
                {{/if}}
              </li>
            {{/each}}
          </ul>
        {{else if (eq block.layout "timeline")}}
          <ol class="mt-6" role="list">
            {{#each block.items as |item i|}}
              <li data-test-timeline={{item.heading}}>
                <div class="relative pb-8">
                  {{#unless (isLast i block.items)}}
                    <span
                      class="absolute top-4 left-4 -ml-px h-full w-0.5 bg-slate-200"
                      aria-hidden="true"
                    ></span>
                  {{/unless}}
                  <div class="relative flex gap-4">
                    <span
                      class="flex size-8 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-base ring-8 ring-white"
                      aria-hidden="true"
                    >{{if item.icon item.icon "•"}}</span>
                    <div class="flex min-w-0 flex-1 justify-between gap-4 pt-1">
                      <div>
                        <h3 class="font-semibold text-slate-900">
                          {{#if item.link}}
                            <a
                              href={{item.link}}
                              class="hover:text-emerald-700"
                            >{{item.heading}}</a>
                          {{else}}
                            {{item.heading}}
                          {{/if}}
                        </h3>
                        {{#if item.text}}
                          <p class="mt-1 text-sm/6 text-slate-600 {{LINK}}">
                            {{html item.text}}
                          </p>
                        {{/if}}
                      </div>
                      {{#if item.date}}
                        <time
                          datetime={{item.date}}
                          class="pt-0.5 font-mono text-sm whitespace-nowrap text-slate-500"
                        >{{formatDate item.date}}</time>
                      {{/if}}
                    </div>
                  </div>
                </div>
              </li>
            {{/each}}
          </ol>
        {{else}}
          <ul class="mt-6 flex flex-wrap gap-3" role="list">
            {{#each block.items as |item|}}
              <li>
                <a
                  href={{item.link}}
                  class="flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-medium text-slate-900 shadow-sm ring-1 ring-slate-900/10 hover:text-emerald-700 hover:ring-emerald-300"
                  data-test-link={{item.heading}}
                >
                  {{#if item.icon}}
                    <span aria-hidden="true">{{item.icon}}</span>
                  {{/if}}
                  {{item.heading}}
                </a>
              </li>
            {{/each}}
          </ul>
        {{/if}}
      </section>
    {{/each}}
  </div>
</template>;
