import Route from '@ember/routing/route';
import { service } from '@ember/service';

import { findAuthor, postsBy } from '../content/requests.ts';
import { orNotFound } from '../content/not-found.ts';

import type Store from '../services/store.ts';

export default class AuthorRoute extends Route {
  @service declare store: Store;

  async model({ author_id }: { author_id: string }) {
    return orNotFound(async () => {
      const [{ content: author }, { content: posts }] = await Promise.all([
        this.store.request(findAuthor(author_id)),
        this.store.request(postsBy(author_id)),
      ]);

      return { author: author.data, posts: posts.data };
    });
  }
}
