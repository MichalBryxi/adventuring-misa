import { LinkTo } from '@ember/routing';

import { ResponsiveImage } from '@responsive-image/ember';

import { postCover } from '../content/covers.ts';
import { Container } from './container.gts';
import { FormattedDate } from './formatted-date.gts';

import type { TOC } from '@ember/component/template-only';
import type { Post } from '../content/schemas.ts';

const PostEntry: TOC<{ Args: { post: Post } }> = <template>
  <article
    aria-labelledby="post-{{@post.id}}-title"
    class="py-10 sm:py-12"
    data-test-post={{@post.id}}
  >
    <Container>
      <div class="flex flex-col items-start gap-6 sm:flex-row">
        <div class="flex flex-1 flex-col items-start">
          <h2
            id="post-{{@post.id}}-title"
            class="mt-2 text-lg font-bold text-slate-900"
          >
            <LinkTo @route="post" @model={{@post.id}}>{{@post.title}}</LinkTo>
          </h2>
          <FormattedDate
            @date={{@post.date}}
            class="order-first font-mono text-sm/7 text-slate-500"
          />
          <p class="mt-1 text-base/7 text-slate-700">{{@post.excerpt}}…</p>
          <div class="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2">
            <LinkTo
              @route="post"
              @model={{@post.id}}
              class="text-sm/6 font-bold text-emerald-600 hover:text-emerald-800 active:text-emerald-900"
            >
              Read the story
            </LinkTo>
            {{#each @post.tags as |tag|}}
              <LinkTo
                @route="tag"
                @model={{tag.id}}
                class="text-sm/6 font-medium text-slate-400 hover:text-slate-600"
              >
                #{{tag.name}}
              </LinkTo>
            {{/each}}
          </div>
        </div>
        {{#let (postCover @post.id) as |cover|}}
          {{#if cover}}
            <LinkTo
              @route="post"
              @model={{@post.id}}
              class="order-first w-full shrink-0 sm:order-last sm:w-40"
              aria-hidden="true"
              tabindex="-1"
            >
              <ResponsiveImage
                @src={{cover}}
                @sizes="(min-width: 640px) 10rem, 100vw"
                alt=""
                loading="lazy"
                decoding="async"
                class="aspect-[4/3] w-full rounded-xl object-cover shadow-md shadow-slate-200"
              />
            </LinkTo>
          {{/if}}
        {{/let}}
      </div>
    </Container>
  </article>
</template>;

export const PostList: TOC<{ Args: { posts: Post[] } }> = <template>
  <div
    class="divide-y divide-slate-100 sm:mt-4 lg:mt-8 lg:border-t lg:border-slate-100"
  >
    {{#each @posts as |post|}}
      <PostEntry @post={{post}} />
    {{/each}}
  </div>
</template>;
