import { ResponsiveImage } from '@responsive-image/ember';
import { pageTitle } from 'ember-page-title';

import { Container } from '../components/container.gts';
import { pageCover } from '../content/covers.ts';
import { PROSE_SIZES, photoUrl } from '../content/photo.ts';
import { Head } from '../components/head.gts';
import { NotFound } from '../components/not-found.gts';
import { Prose } from '../components/prose.gts';

import type { TOC } from '@ember/component/template-only';
import type { Page } from '../content/schemas.ts';

const path = (id: string) => `/page/${id}`;
const previewImage = (id: string) => {
  const cover = pageCover(id);

  return cover ? photoUrl(cover) : undefined;
};

export default <template>
  {{#if @model}}
    {{#let @model.page as |page|}}
      {{pageTitle page.title}}
      <Head
        @title={{page.title}}
        @image={{previewImage page.id}}
        @path={{path page.id}}
      />

      <article class="py-16 lg:py-36" data-test-page={{page.id}}>
        <Container>
          <h1 class="text-4xl font-bold text-slate-900">{{page.title}}</h1>
          {{#let (pageCover page.id) as |cover|}}
            {{#if cover}}
              <ResponsiveImage
                @src={{cover}}
                @sizes={{PROSE_SIZES}}
                alt=""
                loading="eager"
                fetchpriority="high"
                class="mt-10 rounded-2xl shadow-xl shadow-slate-200"
              />
            {{/if}}
          {{/let}}
          {{#if page.html}}
            <Prose @html={{page.html}} class="mt-12" />
          {{/if}}
        </Container>
      </article>
    {{/let}}
  {{else}}
    <NotFound />
  {{/if}}
</template> satisfies TOC<{ Args: { model: { page: Page } | null } }>;
