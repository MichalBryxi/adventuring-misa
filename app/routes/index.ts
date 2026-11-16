import Route from '@ember/routing/route';
import { service } from '@ember/service';

import { allPosts } from '../content/requests.ts';

import type Store from '../services/store.ts';

export default class IndexRoute extends Route {
  @service declare store: Store;

  async model() {
    const { content } = await this.store.request(allPosts());

    return { posts: content.data };
  }
}
