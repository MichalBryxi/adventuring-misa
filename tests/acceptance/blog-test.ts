import { module, test } from 'qunit';
import { click, currentURL, visit } from '@ember/test-helpers';

import { setupApplicationTest } from '../helpers/index.ts';

// These run the real app against the real content/
module('Acceptance | blog', function (hooks) {
  setupApplicationTest(hooks);

  test('the index lists the posts, newest first', async function (assert) {
    await visit('/');

    const ids = [...document.querySelectorAll('[data-test-post]')].map(
      (element) => element.getAttribute('data-test-post') ?? '',
    );

    assert.true(ids.length >= 21, `lists all posts (${ids.length})`);
    // Post ids start with their date. Only the first is checked: a few 2021
    // posts have a front-matter date that doesn't match their file name.
    assert.strictEqual(ids[0], [...ids].sort().at(-1), 'newest first');
  });

  test('a post renders its content, tags and author', async function (assert) {
    await visit('/2021-06-07-an-teallach');

    assert.dom('h1').hasText('An Teallach');
    assert.dom('.prose img').exists();
    assert.dom('a[href="/tag/4-stars"]').hasText('★★★★☆');
    assert.dom('a[href="/author/michal-bryxi"]').hasText('Michal Bryxi');
  });

  test('photos next to the Markdown get bundled URLs', async function (assert) {
    await visit('/2026-11-15-katzenwegli-t6');

    const sources = [...document.querySelectorAll('.prose img')].map(
      (img) => img.getAttribute('src') ?? '',
    );

    assert.true(sources.length > 0);
    assert.true(
      sources.every((src) => !src.startsWith('./') && !src.includes('__ASSET')),
      sources.join(', '),
    );
  });

  test('a tag page lists its posts', async function (assert) {
    await visit('/tag/munro');

    assert.dom('h1').hasText('Munro');
    assert.dom('[data-test-post]').exists({ count: 4 });
  });

  test('the author page lists all posts', async function (assert) {
    await visit('/author/michal-bryxi');

    assert.dom('h1').hasText('Michal Bryxi');
    assert.true(document.querySelectorAll('[data-test-post]').length >= 21);
  });

  test('a static page renders', async function (assert) {
    await visit('/page/about-me');

    assert.dom('h1').hasText('Michal Bryxí');
    assert.dom('.prose a[href*="strava.com"]').exists();
  });

  test('an unknown post is a 404', async function (assert) {
    await visit('/no-such-post');

    assert.dom('[data-test-not-found]').exists();
  });

  test('navigating from the index to a post', async function (assert) {
    await visit('/');
    await click('[data-test-post="2021-06-07-an-teallach"] h2 a');

    assert.strictEqual(currentURL(), '/2021-06-07-an-teallach');
    assert.dom('h1').hasText('An Teallach');
  });
});
