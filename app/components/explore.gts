import { array, hash } from '@ember/helper';
import { on } from '@ember/modifier';
import { LinkTo } from '@ember/routing';

import site from '../../site.mjs';

import type { TOC } from '@ember/component/template-only';

const noop = () => {};

/**
 * The links of the sidebar, also in the mobile menu, which closes itself
 * with @onNavigate when one is followed.
 */
export const Explore: TOC<{
  Element: HTMLElement;
  Args: { onNavigate?: () => void };
}> = <template>
  <section data-test-explore ...attributes>
    <h2
      class="flex items-center font-mono text-sm/7 font-medium text-slate-900"
    >
      <span class="h-2.5 w-2.5 rounded-full bg-sky-300"></span>
      <span class="ml-2.5">Explore</span>
    </h2>
    <ul
      role="list"
      class="mt-4 flex flex-col gap-3 text-base/7 font-semibold text-slate-900"
    >
      <li class="flex items-center gap-2">
        <span class="text-sky-500" aria-hidden="true">→</span>
        {{! Without the tags too: query params are sticky, a plain link to the
            front page would bring back the last filter }}
        <LinkTo
          @route="index"
          @query={{hash tags=""}}
          class="hover:text-emerald-700"
          data-test-all-adventures
          {{on "click" (if @onNavigate @onNavigate noop)}}
        >All adventures</LinkTo>
      </li>
      {{#each site.navigation as |item|}}
        <li class="flex items-center gap-2">
          <span class="text-sky-500" aria-hidden="true">→</span>
          <LinkTo
            @route={{item.route}}
            @models={{if item.id (array item.id) (array)}}
            class="hover:text-emerald-700"
            {{on "click" (if @onNavigate @onNavigate noop)}}
          >{{item.label}}</LinkTo>
        </li>
      {{/each}}
      <li class="flex items-center gap-2">
        <span class="text-sky-500" aria-hidden="true">→</span>
        <a href="/rss.xml" class="hover:text-emerald-700">RSS feed</a>
      </li>
    </ul>
  </section>
</template>;
