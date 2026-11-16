import Route from '@ember/routing/route';
import { service } from '@ember/service';

import { findTag, postsTagged } from '../content/requests.ts';
import { orNotFound } from '../content/not-found.ts';

import type Store from '../services/store.ts';

export default class TagRoute extends Route {
  @service declare store: Store;

  async model({ tag_id }: { tag_id: string }) {
    return orNotFound(async () => {
      const [{ content: tag }, { content: posts }] = await Promise.all([
        this.store.request(findTag(tag_id)),
        this.store.request(postsTagged(tag_id)),
      ]);

      return { tag: tag.data, posts: posts.data };
    });
  }
}
