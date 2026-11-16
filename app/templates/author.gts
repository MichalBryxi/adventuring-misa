import { pageTitle } from 'ember-page-title';

import { Container } from '../components/container.gts';
import { Head } from '../components/head.gts';
import { NotFound } from '../components/not-found.gts';
import { PostList } from '../components/post-list.gts';

import type { TOC } from '@ember/component/template-only';
import type { Author, Post } from '../content/schemas.ts';

const path = (id: string) => `/author/${id}`;

export default <template>
  {{#if @model}}
    {{#let @model.author as |author|}}
      {{pageTitle author.name}}
      <Head
        @title={{author.name}}
        @image={{author.image}}
        @path={{path author.id}}
      />

      <div class="pt-16 pb-12 sm:pb-4 lg:pt-12" data-test-author={{author.id}}>
        <Container>
          <div class="flex items-center gap-4">
            {{#if author.image}}
              <img
                src={{author.image}}
                alt=""
                class="h-14 w-14 rounded-full ring-1 ring-slate-200"
              />
            {{/if}}
            <div>
              <h1 class="text-2xl/7 font-bold text-slate-900">
                {{author.name}}
              </h1>
              {{#if author.website}}
                <a
                  href={{author.website}}
                  class="text-sm/6 font-bold text-emerald-600 hover:text-emerald-800"
                >{{author.website}}</a>
              {{/if}}
            </div>
          </div>
        </Container>
        <PostList @posts={{@model.posts}} />
      </div>
    {{/let}}
  {{else}}
    <NotFound />
  {{/if}}
</template> satisfies TOC<{
  Args: { model: { author: Author; posts: Post[] } | null };
}>;
