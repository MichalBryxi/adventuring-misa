import { hash } from '@ember/helper';
import { LinkTo } from '@ember/routing';

import { t } from 'ember-intl';

import site from '../../site.mjs';
import { Container } from '../components/container.gts';
import { Head } from '../components/head.gts';
import { PostList } from '../components/post-list.gts';
import { tagKey } from '../content/tag-cloud.ts';

import type { TOC } from '@ember/component/template-only';
import type { Post } from '../content/schemas.ts';

interface Filter {
  id: string;
  without: string;
}

export default <template>
  <Head @path="/" />

  <div class="pt-16 pb-12 sm:pb-4 lg:pt-12">
    <Container>
      <h1 class="text-2xl/7 font-bold text-slate-900">Adventures</h1>
      <p class="sr-only">{{site.description}}</p>

      {{#if @model.filter.length}}
        <div
          class="mt-4 flex flex-wrap items-center gap-2 text-sm/6"
          data-test-filter
        >
          <span class="font-mono text-slate-500">Filters</span>
          {{#each @model.filter as |tag|}}
            <LinkTo
              @route="index"
              @query={{hash tags=tag.without}}
              class="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-0.5 font-medium text-emerald-900 ring-1 ring-emerald-200 hover:bg-emerald-100"
              title="Remove {{t (tagKey tag.id)}}"
              data-test-filter-tag={{tag.id}}
            >{{t (tagKey tag.id)}}<span aria-hidden="true">×</span></LinkTo>
          {{/each}}
          <LinkTo
            @route="index"
            @query={{hash tags=""}}
            class="font-medium text-slate-500 underline hover:text-slate-900"
            data-test-filter-clear
          >Clear</LinkTo>
        </div>
      {{/if}}
    </Container>

    {{#if @model.posts.length}}
      <PostList @posts={{@model.posts}} />
    {{else}}
      <Container>
        <p class="mt-10 text-base/7 text-slate-700" data-test-no-posts>
          No adventure has all of these tags yet.
        </p>
      </Container>
    {{/if}}
  </div>
</template> satisfies TOC<{
  Args: { model: { posts: Post[]; filter: Filter[] } };
}>;
