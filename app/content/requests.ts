import { withReactiveResponse } from '@warp-drive/core/request';

import type { Author, Page, Post, Tag } from './schemas.ts';

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

export const postsBy = (author: string) =>
  withReactiveResponse<Post[]>(
    get(`/posts?author=${encodeURIComponent(author)}`, 'post', 'query'),
  );

export const findPost = (id: string) =>
  withReactiveResponse<Post>(get(`/posts/${id}`, 'post', 'findRecord'));

export const findPage = (id: string) =>
  withReactiveResponse<Page>(get(`/pages/${id}`, 'page', 'findRecord'));

export const findTag = (id: string) =>
  withReactiveResponse<Tag>(get(`/tags/${id}`, 'tag', 'findRecord'));

export const findAuthor = (id: string) =>
  withReactiveResponse<Author>(get(`/authors/${id}`, 'author', 'findRecord'));
