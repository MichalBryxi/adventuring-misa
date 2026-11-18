import { htmlSafe } from '@ember/template';

import type { TOC } from '@ember/component/template-only';
import type { Learning } from '../content/schemas.ts';

/**
 * A post's `learnings:` front matter as a checklist: ticked what I did right,
 * crossed what I did wrong, with why (lib/learnings.mjs). It goes after the
 * story, or where the story has a `<!-- learnings -->`
 * (app/content/learnings.ts).
 */
export const Learnings: TOC<{
  Element: HTMLElement;
  Args: { learnings: Learning[] };
}> = <template>
  <section aria-labelledby="learnings-title" data-test-learnings ...attributes>
    <h2 id="learnings-title" class="section-heading before:bg-amber-300">
      Learnings
    </h2>
    <ul class="mt-6 space-y-3 text-sm/6 text-slate-700" role="list">
      {{#each @learnings as |entry|}}
        <li
          class="flex gap-3"
          data-test-learning={{entry.text}}
          data-test-good={{if entry.good "true" "false"}}
        >
          {{#if entry.good}}
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
            <span class="font-medium text-slate-900">{{entry.text}}</span>
            <span class="sr-only">{{if
                entry.good
                "(did right)"
                "(did wrong)"
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
