import { LinkTo } from '@ember/routing';

import { pageTitle } from 'ember-page-title';

import type { TOC } from '@ember/component/template-only';

export const NotFound: TOC<object> = <template>
  {{pageTitle "Not found"}}

  <div
    class="relative mx-auto flex w-full max-w-2xl flex-col items-center px-4 py-36 sm:px-6 lg:px-0"
    data-test-not-found
  >
    <p class="font-mono text-sm/7 text-slate-500">404</p>
    <h1 class="mt-4 text-lg font-bold text-slate-900">Page not found</h1>
    <p class="mt-2 text-base/7 text-slate-700">
      Sorry, this trail doesn’t go anywhere.
    </p>
    <LinkTo
      @route="index"
      class="mt-4 text-sm/6 font-bold text-emerald-600 hover:text-emerald-800 active:text-emerald-900"
    >
      Go back home
    </LinkTo>
  </div>
</template>;
