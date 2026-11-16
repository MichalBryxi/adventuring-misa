import { hash } from '@ember/helper';
import { LinkTo } from '@ember/routing';

import { ResponsiveImage } from '@responsive-image/ember';
import { pageTitle } from 'ember-page-title';

import { Container } from '../components/container.gts';
import { postCover } from '../content/covers.ts';
import { PROSE_SIZES, photoUrl } from '../content/photo.ts';
import { Facts } from '../components/facts.gts';
import { FormattedDate } from '../components/formatted-date.gts';
import { Gear } from '../components/gear.gts';
import { Gallery } from '../components/gallery.gts';
import { Head } from '../components/head.gts';
import { NotFound } from '../components/not-found.gts';
import { Prose } from '../components/prose.gts';

import type { TOC } from '@ember/component/template-only';
import type { GalleryPhoto } from '../content/gallery.ts';
import type { Post } from '../content/schemas.ts';

const path = (id: string) => `/${id}`;
const previewImage = (id: string) => {
  const cover = postCover(id);

  return cover ? photoUrl(cover) : undefined;
};

export default <template>
  {{#if @model}}
    {{#let @model.post as |post|}}
      {{pageTitle post.title}}
      <Head
        @title={{post.title}}
        @description={{post.excerpt}}
        @image={{previewImage post.id}}
        @path={{path post.id}}
        @type="article"
      />

      <article class="py-16 lg:py-36" data-test-post-page={{post.id}}>
        <Container>
          <header class="flex flex-col">
            <h1 class="mt-2 text-4xl font-bold text-slate-900">
              {{post.title}}
            </h1>
            <p
              class="order-first flex flex-wrap items-center gap-x-3 font-mono text-sm/7 text-slate-500"
            >
              <FormattedDate @date={{post.date}} />
            </p>
            {{#if post.tags}}
              <ul
                class="mt-4 flex flex-wrap gap-2"
                aria-label="Tags"
                role="list"
              >
                {{#each post.tags as |tag|}}
                  <li>
                    <LinkTo
                      @route="index"
                      @query={{hash tags=tag.id}}
                      class="inline-flex rounded-full bg-slate-100 px-3 py-0.5 text-sm/6 font-medium text-slate-700 hover:bg-emerald-100 hover:text-emerald-900"
                    >{{tag.name}}</LinkTo>
                  </li>
                {{/each}}
              </ul>
            {{/if}}
          </header>

          {{#let (postCover post.id) as |cover|}}
            {{#if cover}}
              <figure class="mt-10">
                <ResponsiveImage
                  @src={{cover}}
                  @sizes={{PROSE_SIZES}}
                  alt=""
                  loading="eager"
                  fetchpriority="high"
                  class="rounded-2xl shadow-xl shadow-slate-200"
                />
                {{#if post.imageMeta.attribution}}
                  <figcaption class="mt-2 text-sm text-slate-500">
                    Photo by
                    <a
                      href={{post.imageMeta.attributionLink}}
                      class="underline"
                    >{{post.imageMeta.attribution}}</a>
                  </figcaption>
                {{/if}}
              </figure>
            {{/if}}
          {{/let}}

          <hr class="my-12 border-slate-200" />

          {{#if post.facts}}
            <Facts @facts={{post.facts}} />
          {{/if}}

          {{#if post.html}}
            <Prose @html={{post.html}} />
          {{/if}}

          {{#if post.gear.length}}
            <Gear @gear={{post.gear}} class="mt-16" />
          {{/if}}

          {{#if @model.gallery.length}}
            <Gallery @photos={{@model.gallery}} />
          {{/if}}

          <nav
            class="mt-16 grid gap-6 border-t border-slate-200 pt-8 text-sm/6 font-bold sm:grid-cols-2"
            aria-label="More stories"
          >
            {{#if @model.newer}}
              <LinkTo
                @route="post"
                @model={{@model.newer.id}}
                class="text-emerald-600 hover:text-emerald-800"
              >← {{@model.newer.title}}</LinkTo>
            {{/if}}
            {{#if @model.older}}
              <LinkTo
                @route="post"
                @model={{@model.older.id}}
                class="text-emerald-600 hover:text-emerald-800 sm:col-start-2 sm:text-right"
              >{{@model.older.title}} →</LinkTo>
            {{/if}}
          </nav>
        </Container>
      </article>
    {{/let}}
  {{else}}
    <NotFound />
  {{/if}}
</template> satisfies TOC<{
  Args: {
    model: {
      post: Post;
      newer?: Post;
      older?: Post;
      gallery: GalleryPhoto[];
    } | null;
  };
}>;
