import { withReactiveResponse } from '@warp-drive/core/request';

import type { Page, Post, Tag } from './schemas.ts';

/**
 * The requests the routes make. ContentHandler answers them.
 */

function get(url: string, type: string, op: 'findRecord' | 'query') {
  return { url, method: 'GET' as const, op, cacheOptions: { types: [type] } };
}

export const allPosts = () =>
  withReactiveResponse<Post[]>(get('/posts', 'post', 'query'));

export const postsTagged = (tag: string) =>
  withReactiveResponse<Post[]>(
    get(`/posts?tag=${encodeURIComponent(tag)}`, 'post', 'query'),
  );

export const findPost = (id: string) =>
  withReactiveResponse<Post>(get(`/posts/${id}`, 'post', 'findRecord'));

export const findPage = (id: string) =>
  withReactiveResponse<Page>(get(`/pages/${id}`, 'page', 'findRecord'));

export const findTag = (id: string) =>
  withReactiveResponse<Tag>(get(`/tags/${id}`, 'tag', 'findRecord'));
