import { htmlSafe } from '@ember/template';

import type { TOC } from '@ember/component/template-only';
import type { GearItem } from '../content/schemas.ts';

/**
 * A post's `gear:` front matter as a checklist after the story: ticked what
 * I had, crossed what I should have had, with why (lib/gear.mjs).
 */
export const Gear: TOC<{
  Element: HTMLElement;
  Args: { gear: GearItem[] };
}> = <template>
  <section aria-labelledby="gear-title" data-test-gear ...attributes>
    <h2 id="gear-title" class="section-heading before:bg-amber-300">
      The gear
    </h2>
    <ul class="mt-6 space-y-3 text-sm/6 text-slate-700" role="list">
      {{#each @gear as |entry|}}
        <li
          class="flex gap-3"
          data-test-gear-item={{entry.item}}
          data-test-packed={{if entry.packed "true" "false"}}
        >
          {{#if entry.packed}}
            <svg
              viewBox="0 0 20 20"
              class="mt-0.5 size-5 shrink-0 rounded-md bg-emerald-100 p-0.5 text-emerald-700"
              aria-hidden="true"
            >
              <path
                d="M5 10.5l3 3 7-7"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          {{else}}
            <svg
              viewBox="0 0 20 20"
              class="mt-0.5 size-5 shrink-0 rounded-md bg-rose-100 p-0.5 text-rose-700"
              aria-hidden="true"
            >
              <path
                d="M6 6l8 8M14 6l-8 8"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
              />
            </svg>
          {{/if}}
          <div>
            <span class="font-medium text-slate-900">{{entry.item}}</span>
            <span class="sr-only">{{if
                entry.packed
                "(had it)"
                "(didn't have it)"
              }}</span>
            {{#if entry.note}}
              <p
                class="text-slate-600 [&_a]:text-emerald-700 [&_a]:underline"
              >{{htmlSafe entry.note}}</p>
            {{/if}}
          </div>
        </li>
      {{/each}}
    </ul>
  </section>
</template>;
