import { pageTitle } from 'ember-page-title';

import { Container } from '../components/container.gts';
import { Head } from '../components/head.gts';
import { Prose } from '../components/prose.gts';

import type { TOC } from '@ember/component/template-only';

const TITLE = 'Changelog';
const DESCRIPTION = 'What changed on the blog, newest first.';

/**
 * CHANGELOG.md from the repository, as a page.
 */
export default <template>
  {{pageTitle TITLE}}
  <Head @title={{TITLE}} @description={{DESCRIPTION}} @path="/changelog" />

  <article class="py-16 lg:py-36" data-test-page="changelog">
    <Container>
      <h1 class="text-4xl font-bold text-slate-900">{{TITLE}}</h1>
      {{! File names and code everywhere: pills, not typography's backticks }}
      <Prose
        @html={{@model.html}}
        class="mt-12 prose-code:rounded prose-code:bg-slate-100 prose-code:px-1 prose-code:py-0.5 prose-code:font-medium prose-code:before:content-none prose-code:after:content-none"
      />
    </Container>
  </article>
</template> satisfies TOC<{ Args: { model: { html: string } } }>;
