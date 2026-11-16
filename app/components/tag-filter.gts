import Component from '@glimmer/component';
import { hash } from '@ember/helper';
import { LinkTo } from '@ember/routing';
import { service } from '@ember/service';

import { TAG_CLOUD, TAG_GROUPS } from '../content/tag-cloud.ts';
import { selectedTags, toggleTag } from '../content/tag-filter.ts';

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
      }}"
    title="{{@tag.count}} {{if (eq @tag.count 1) 'post' 'posts'}}"
    data-test-selected={{includes @selected @tag.id}}
    data-test-cloud-tag={{@tag.id}}
  >{{@tag.name}}</LinkTo>
</template>;

/**
 * The tags in the sidebar, as a filter of the front page: each one adds
 * itself to the `tags` query parameter, or takes itself out, and the
 * front page lists the posts that have all of them. Tags with a parent
 * are under its name, after the cloud.
 */
export class TagFilter extends Component<{ Element: HTMLElement }> {
  @service declare router: RouterService;

  get selected() {
    const route = this.router.currentRoute;

    return route?.name === 'index'
      ? selectedTags(route.queryParams['tags'] as string | undefined)
      : [];
  }

  <template>
    <section ...attributes>
      <h2
        class="flex items-center justify-center font-mono text-sm/7 font-medium text-slate-900 lg:justify-start"
      >
        <span class="h-2.5 w-2.5 rounded-full bg-amber-300"></span>
        <span class="ml-2.5">Tags</span>
      </h2>
      <ul
        role="list"
        class="mt-4 flex flex-wrap items-center justify-center gap-x-2.5 gap-y-1 leading-none font-medium"
        data-test-tag-cloud
      >
        {{#each TAG_CLOUD as |tag|}}
          <li><TagLink @tag={{tag}} @selected={{this.selected}} /></li>
        {{/each}}
      </ul>

      {{#each TAG_GROUPS as |group|}}
        <h3
          class="mt-6 text-center font-mono text-xs/6 font-medium text-slate-500 lg:text-left"
          data-test-tag-group={{group.id}}
        >{{group.name}}</h3>
        <ul
          role="list"
          class="mt-2 flex flex-wrap items-center justify-center gap-x-3 gap-y-1 leading-none font-medium lg:justify-start"
        >
          {{#each group.tags as |tag|}}
            <li class="flex items-baseline gap-1">
              <TagLink @tag={{tag}} @selected={{this.selected}} />
              <span
                class="font-mono text-xs text-slate-400"
              >{{tag.count}}</span>
            </li>
          {{/each}}
        </ul>
      {{/each}}
    </section>
  </template>
}
