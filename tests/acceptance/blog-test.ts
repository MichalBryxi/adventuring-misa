import { module, test } from 'qunit';
import { click, currentURL, triggerKeyEvent, visit } from '@ember/test-helpers';

import { setupApplicationTest } from '../helpers/index.ts';

import { allPosts } from '../../app/content/requests.ts';

import type Store from '../../app/services/store.ts';

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
    assert.dom('.prose p').exists();
    assert.dom('[data-test-gallery-photo]').exists({ count: 4 });
    assert.dom('a[href="/tag/4-stars"]').hasText('★★★★☆');
    assert.dom('a[href="/author/michal-bryxi"]').hasText('Michal Bryxi');
  });

  test('photos next to the Markdown get bundled URLs', async function (assert) {
    // A post that keeps its screenshots in the text, and one with a gallery
    await visit('/2024-01-01-windy-colour-scale-of-wind-for-paragliding');

    const sources = [...document.querySelectorAll('.prose img')].map(
      (img) => img.getAttribute('src') ?? '',
    );

    await visit('/2026-11-15-katzenwegli-t6');

    sources.push(
      ...[...document.querySelectorAll('[data-test-gallery] img')].map(
        (img) => img.getAttribute('src') ?? '',
      ),
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

  test('a photo from the gallery opens in a lightbox', async function (assert) {
    await visit('/2026-11-15-katzenwegli-t6');

    assert.dom('[data-test-gallery-photo]').exists({ count: 8 });
    assert.dom('[data-test-lightbox]').doesNotExist();

    await click('[data-test-gallery-photo]');

    assert.dom('[data-test-lightbox]').exists();
    assert.true(
      (document.querySelector('[data-test-lightbox]') as HTMLDialogElement)
        .open,
      'opens as a modal dialog',
    );
    assert.dom('[data-test-lightbox-position]').hasText('1 / 8');
    assert.dom('[data-test-lightbox-caption]').hasAnyText();

    await click('[data-test-lightbox-next]');
    assert.dom('[data-test-lightbox-position]').hasText('2 / 8');

    await triggerKeyEvent('[data-test-lightbox]', 'keydown', 'ArrowLeft');
    await triggerKeyEvent('[data-test-lightbox]', 'keydown', 'ArrowLeft');
    assert
      .dom('[data-test-lightbox-position]')
      .hasText('8 / 8', 'wraps around');

    await click('[data-test-lightbox-close]');
    assert.dom('[data-test-lightbox]').doesNotExist();
  });

  test('a post shows its facts before the story', async function (assert) {
    await visit('/2026-11-15-katzenwegli-t6');

    assert.dom('[data-test-facts]').exists();
    assert.dom('[data-test-fact="Ascent"] td').hasText('1,820 m');
    assert.dom('[data-test-fact="Duration"] td').hasText('5 h 36 min');
    assert
      .dom('[data-test-fact="Grade"] a')
      .hasText('T6')
      .hasAttribute('href', /SAC-Wanderskala/);
    assert.dom('[data-test-fact="Links"] a').hasText('Strava');
  });

  test('posts can be filtered by their facts', async function (assert) {
    const store = this.owner.lookup('service:store') as Store;
    const { content } = await store.request(allPosts());

    const bigClimbs = content.data
      .filter((post) => (post.facts?.ascent ?? 0) > 2000)
      .map((post) => post.id);

    assert.deepEqual(bigClimbs, ['2019-09-21-salomon-ring-of-steall-skyrace']);
  });

  test('a post shows its gear as a checklist', async function (assert) {
    await visit('/2026-11-15-katzenwegli-t6');

    assert.dom('[data-test-gear-item]').exists({ count: 3 });
    assert
      .dom('[data-test-gear-item="Microspikes"]')
      .hasAttribute('data-test-packed', 'true');
    assert
      .dom('[data-test-gear-item="Ice axe"]')
      .hasAttribute('data-test-packed', 'false')
      .includesText('Mistake');
    assert.dom('[data-test-fact="Gear"]').doesNotExist('not a fact any more');
  });
});
