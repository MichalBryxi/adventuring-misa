import { module, test } from 'qunit';
import {
  click,
  currentURL,
  triggerEvent,
  triggerKeyEvent,
  visit,
} from '@ember/test-helpers';

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

  test('a post renders its content and tags', async function (assert) {
    await visit('/2021-06-07-an-teallach');

    assert.dom('h1').hasText('An Teallach');
    assert.dom('.prose p').exists();
    assert.dom('[data-test-gallery-photo]').exists({ count: 4 });
    assert.dom('a[href="/?tags=rating%2F4-stars"]').hasText('★★★★☆');
    assert.dom('a[href^="/author/"]').doesNotExist('no author byline');
    assert
      .dom('[data-test-owner]')
      .exists({ count: 2 }, 'sidebar and footer')
      .hasAttribute('href', '/page/about-me');
  });

  test('the sidebar has a tag cloud sized by use', async function (assert) {
    await visit('/');

    const size = (id: string) =>
      parseFloat(
        getComputedStyle(
          document.querySelector(`[data-test-cloud-tag="${id}"]`)!,
        ).fontSize,
      );

    assert
      .dom('[data-test-cloud-tag="munro"]')
      .hasText('Munro')
      .hasAttribute('href', '/?tags=munro');
    assert
      .dom('[data-test-tag-cloud] [data-test-cloud-tag="rating/4-stars"]')
      .doesNotExist('ratings are a group of their own');
    assert.dom('[data-test-tag-group="rating"]').hasText('Rating');
    assert.dom('[data-test-cloud-tag="rating/4-stars"]').hasText('★★★★☆');
    assert.true(size('munro') > size('shoes'), 'more posts, bigger tag');
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

  test('the sidebar tags filter the posts, all of them at once', async function (assert) {
    await visit('/');
    await click('[data-test-cloud-tag="munro"]');

    assert.strictEqual(currentURL(), '/?tags=munro');
    assert.dom('[data-test-post]').exists({ count: 4 });
    assert
      .dom('[data-test-cloud-tag="rating/5-stars"]')
      .hasAttribute('data-test-leads-nowhere', '', 'no ★★★★★ Munro yet');
    assert
      .dom('[data-test-cloud-tag="rating/2-stars"]')
      .doesNotHaveAttribute('data-test-leads-nowhere', 'but ★★☆☆☆ ones');

    await click('[data-test-cloud-tag="rating/4-stars"]');

    assert.strictEqual(currentURL(), '/?tags=munro%2Crating%2F4-stars');
    assert.dom('[data-test-post]').exists({ count: 2 }, 'Munros AND ★★★★☆');
    assert.dom('[data-test-filter-tag]').exists({ count: 2 });
    assert
      .dom('[data-test-cloud-tag="munro"]')
      .hasAttribute('data-test-selected');

    await click('[data-test-cloud-tag="munro"]');

    assert.strictEqual(
      currentURL(),
      '/?tags=rating%2F4-stars',
      'a selected tag toggles off',
    );

    await click('[data-test-filter-clear]');

    assert.strictEqual(currentURL(), '/');
    assert.dom('[data-test-filter]').doesNotExist();
  });

  test('the mobile menu opens the sidebar in a drawer', async function (assert) {
    await visit('/');
    await click('[data-test-menu-button]');

    assert.dom('[data-test-mobile-nav]').exists();
    assert.dom('[data-test-show-posts]').hasText('Show 21 adventures');

    await click('[data-test-mobile-nav] [data-test-cloud-tag="munro"]');

    assert.strictEqual(currentURL(), '/?tags=munro');
    assert
      .dom('[data-test-mobile-nav]')
      .exists('picking a tag keeps the drawer open');
    assert.dom('[data-test-show-posts]').hasText('Show 4 adventures');

    await click('[data-test-show-posts]');

    assert.dom('[data-test-mobile-nav]').doesNotExist();
    assert.dom('[data-test-post]').exists({ count: 4 });
  });

  test('a tap opens the mobile menu and leaves it open', async function (assert) {
    await visit('/');

    // A finger: pointerdown and pointerup, then the click the browser sends
    // after them, which must not close the drawer it just opened
    const touch = { pointerType: 'touch', isPrimary: true };

    await triggerEvent('[data-test-menu-button]', 'pointerdown', touch);
    await triggerEvent('[data-test-menu-button]', 'pointerup', touch);
    await click('[data-test-menu-button]');

    assert.dom('[data-test-mobile-nav]').exists();
  });

  test('a filter nothing matches says so', async function (assert) {
    await visit('/?tags=munro,rating/5-stars');

    assert.dom('[data-test-post]').doesNotExist();
    assert.dom('[data-test-no-posts]').exists();
  });

  test('the About me page renders its sections', async function (assert) {
    await visit('/page/about-me');

    assert.dom('h1').hasText('Michal Bryxí');
    assert.dom('[data-test-card="Paragliding"]').includesText('IPPI 4');
    assert
      .dom('[data-test-timeline="Basic avalanche training"] time')
      .hasText('Feb 2024');
    assert.dom('[data-test-link="Strava"]').hasAttribute('href', /strava\.com/);
  });

  test('All adventures in Explore lists every post, without the filter', async function (assert) {
    await visit('/?tags=munro');
    await click('[data-test-explore] [data-test-all-adventures]');

    assert.strictEqual(currentURL(), '/');
    assert.dom('[data-test-filter]').doesNotExist();
    assert.dom('[data-test-post]').exists({ count: 21 });
  });

  test('a post asks for a note by email instead of comments', async function (assert) {
    await visit('/2026-11-15-katzenwegli-t6');

    const href = document
      .querySelector('[data-test-feedback-link]')!
      .getAttribute('href')!;
    const url = new URL(href);

    assert.strictEqual(url.protocol, 'mailto:');
    assert.strictEqual(url.pathname, 'michal.bryxi@gmail.com');
    assert.strictEqual(
      url.searchParams.get('subject'),
      'T6: Von Stechelberg über das Katzenwegli',
    );
    assert.strictEqual(
      url.searchParams.get('body'),
      'Hey Míša,\r\n\r\nI read your article "T6: Von Stechelberg über das Katzenwegli" (https://adventuring-misa.pudr.com/2026-11-15-katzenwegli-t6) and I wanted to say:\r\n\r\n[fill in your text here]\r\n',
    );
  });

  test('the changelog is a page, from CHANGELOG.md', async function (assert) {
    await visit('/');
    await click('[data-test-explore] a[href="/changelog"]');

    assert.strictEqual(currentURL(), '/changelog');
    assert.dom('h1').exists({ count: 1 }).hasText('Changelog');
    assert.dom('[data-test-page="changelog"] h2').exists();
    assert.dom('[data-test-page="changelog"] h3').includesText('Added');
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
      .dom('[data-test-fact="Points"] td')
      .hasText('Stechelberg (910 m) → Silberhornhütte (2,663 m)');
    assert
      .dom('[data-test-fact="Grade"] a')
      .hasText('T6')
      .hasAttribute('href', /SAC-Wanderskala/);
    assert.dom('[data-test-fact="Links"] td').hasText('SAC route · Strava');
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
