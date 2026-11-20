import Component from '@glimmer/component';
import { hash } from '@ember/helper';
import { LinkTo } from '@ember/routing';
import { service } from '@ember/service';

import { t } from 'ember-intl';

import {
  leadsNowhere,
  TAG_CLOUD,
  TAG_GROUPS,
  tagKey,
  tagValue,
} from '../content/tag-cloud.ts';
import { currentTags, toggleTag } from '../content/tag-filter.ts';

import type { TOC } from '@ember/component/template-only';
import type RouterService from '@ember/routing/router-service';
import type { CloudTag } from '../content/tag-cloud.ts';

const eq = (a: unknown, b: unknown) => a === b;
const includes = (list: string[], item: string) => list.includes(item);

const TagLink: TOC<{
  Args: { tag: CloudTag; selected: string[] };
}> = <template>
  <LinkTo
    @route="index"
    @query={{hash tags=(toggleTag @selected @tag.id)}}
    class="{{@tag.size}}
      {{@tag.colour}}
      {{if
        (includes @selected @tag.id)
        'rounded-md bg-current/10 px-1.5 py-0.5 ring-1 ring-current'
        'hover:underline'
      }}
      {{if (leadsNowhere @selected @tag.id) 'line-through opacity-50'}}"
    title="{{@tag.count}} {{if (eq @tag.count 1) 'post' 'posts'}}"
    data-test-selected={{includes @selected @tag.id}}
    data-test-leads-nowhere={{leadsNowhere @selected @tag.id}}
    data-test-cloud-tag={{@tag.id}}
  >{{t (tagKey @tag.id) value=(tagValue @tag.id)}}</LinkTo>
</template>;

/**
 * The tags in the sidebar, as a filter of the front page: each one adds
 * itself to the `tags` query parameter, or takes itself out, and the
 * front page lists the posts that have all of them. Tags in a group
 * (rating/4-stars) are under its name, after the cloud.
 */
export class TagFilter extends Component<{ Element: HTMLElement }> {
  @service declare router: RouterService;

  get selected() {
    return currentTags(this.router);
  }

  <template>
    <section ...attributes>
      <h2
        class="flex items-center font-mono text-sm/7 font-medium text-slate-900"
      >
        <span class="h-2.5 w-2.5 rounded-full bg-amber-300"></span>
        <span class="ml-2.5">Tags</span>
      </h2>
      <ul
        role="list"
        class="mt-4 flex flex-wrap items-center gap-x-2.5 gap-y-1 leading-none font-medium"
        data-test-tag-cloud
      >
        {{#each TAG_CLOUD as |tag|}}
          <li><TagLink @tag={{tag}} @selected={{this.selected}} /></li>
        {{/each}}
      </ul>

      {{#each TAG_GROUPS as |group|}}
        <h3
          class="mt-6 font-mono text-xs/6 font-medium text-slate-500"
          data-test-tag-group={{group.id}}
        >{{t (tagKey group.id)}}</h3>
        <ul
          role="list"
          class="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 leading-none font-medium"
        >
          {{#each group.tags as |tag|}}
            <li><TagLink @tag={{tag}} @selected={{this.selected}} /></li>
          {{/each}}
        </ul>
      {{/each}}
    </section>
  </template>
}
