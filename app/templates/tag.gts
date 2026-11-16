import { pageTitle } from 'ember-page-title';

import { Container } from '../components/container.gts';
import { Head } from '../components/head.gts';
import { NotFound } from '../components/not-found.gts';
import { PostList } from '../components/post-list.gts';

import type { TOC } from '@ember/component/template-only';
import type { Post, Tag } from '../content/schemas.ts';

const path = (id: string) => `/tag/${id}`;

export default <template>
  {{#if @model}}
    {{#let @model.tag as |tag|}}
      {{pageTitle tag.name}}
      <Head
        @title={{tag.name}}
        @description={{tag.excerpt}}
        @path={{path tag.id}}
      />

      <div class="pt-16 pb-12 sm:pb-4 lg:pt-12" data-test-tag={{tag.id}}>
        <Container>
          <p class="font-mono text-sm/7 text-slate-500">Tag</p>
          <h1 class="text-2xl/7 font-bold text-slate-900">{{tag.name}}</h1>
          {{#if tag.excerpt}}
            <p class="mt-3 text-base/7 text-slate-700">{{tag.excerpt}}</p>
          {{/if}}
        </Container>
        <PostList @posts={{@model.posts}} />
      </div>
    {{/let}}
  {{else}}
    <NotFound />
  {{/if}}
</template> satisfies TOC<{
  Args: { model: { tag: Tag; posts: Post[] } | null };
}>;
