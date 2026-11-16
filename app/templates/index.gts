import site from '../../site.mjs';
import { Container } from '../components/container.gts';
import { Head } from '../components/head.gts';
import { PostList } from '../components/post-list.gts';

import type { TOC } from '@ember/component/template-only';
import type { Post } from '../content/schemas.ts';

export default <template>
  <Head @path="/" />

  <div class="pt-16 pb-12 sm:pb-4 lg:pt-12">
    <Container>
      <h1 class="text-2xl/7 font-bold text-slate-900">Adventures</h1>
      <p class="sr-only">{{site.description}}</p>
    </Container>
    <PostList @posts={{@model.posts}} />
  </div>
</template> satisfies TOC<{ Args: { model: { posts: Post[] } } }>;
