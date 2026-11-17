import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { LinkTo } from '@ember/routing';
import { on } from '@ember/modifier';
import { service } from '@ember/service';

import { ResponsiveImage } from '@responsive-image/ember';
import { Button } from 'frontile/buttons';
import { Drawer } from 'frontile/overlays';

import site from '../../site.mjs';
import cover from '../../content/cover.jpg?responsive';
import { matchingCount } from '../content/tag-cloud.ts';
import { currentTags } from '../content/tag-filter.ts';
import { Explore } from './explore.gts';
import { TagFilter } from './tag-filter.gts';

import type RouterService from '@ember/routing/router-service';

const eq = (a: unknown, b: unknown) => a === b;

/**
 * Below lg, the sidebar would push the posts a screen down: instead a bar
 * at the top, whose menu button opens the sidebar's links and tags in a
 * drawer from the left (Frontile's navigation drawer). Tags don't close
 * it, so several can be picked; the footer button shows the result.
 */
export class MobileNav extends Component<{ Element: HTMLDivElement }> {
  @service declare router: RouterService;

  @tracked isOpen = false;

  open = () => {
    this.isOpen = true;
  };

  close = () => {
    this.isOpen = false;
  };

  // From a post, the front page with what the tags picked
  showPosts = () => {
    this.close();

    if (this.router.currentRouteName !== 'index') {
      void this.router.transitionTo('index');
    }
  };

  get selected() {
    return currentTags(this.router);
  }

  get matching() {
    return matchingCount(this.selected);
  }

  <template>
    <div
      class="sticky top-0 z-30 flex items-center gap-3 border-b border-slate-200 bg-white/90 px-4 py-2 backdrop-blur sm:px-6 lg:hidden"
      ...attributes
    >
      {{! Opens on click, not @onPress: a tap's click comes after pointerup,
          and would land on the backdrop of the just-opened drawer and close
          it again (Frontile 0.18.10 stops it too late) }}
      <Button
        @variant="plain"
        @size="sm"
        {{on "click" this.open}}
        aria-label="Menu"
        aria-expanded={{if this.isOpen "true" "false"}}
        @class="relative -ml-2"
        data-test-menu-button
      >
        <svg
          class="size-6 text-slate-900"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          aria-hidden="true"
        >
          <path d="M4 6h16M4 12h16M4 18h16" />
        </svg>
        {{#if this.selected.length}}
          <span
            class="absolute -top-0.5 -right-0.5 flex size-4 items-center justify-center rounded-full bg-emerald-600 text-[10px] font-bold text-white"
            aria-label="{{this.selected.length}} filters"
          >{{this.selected.length}}</span>
        {{/if}}
      </Button>
      <LinkTo
        @route="index"
        class="flex min-w-0 items-center gap-2.5 font-bold text-slate-900"
      >
        {{! Zoomed in 4.5× on the face: 55% across, 38% down content/cover.jpg }}
        <span
          class="relative size-8 shrink-0 overflow-hidden rounded-full ring-1 ring-black/10"
        >
          <ResponsiveImage
            @src={{cover}}
            @width={{144}}
            alt=""
            class="absolute top-[-121%] left-[-197.5%] w-[450%] max-w-none"
          />
        </span>
        <span class="truncate">{{site.title}}</span>
      </LinkTo>
    </div>

    <Drawer
      @isOpen={{this.isOpen}}
      @onClose={{this.close}}
      @placement="left"
      @size="sm"
      @backdrop="faded"
      @variant="flat"
      as |d|
    >
      <d.Header @title={{site.title}} @description={{site.description}} />
      <d.Body>
        <div data-test-mobile-nav>
          <Explore @onNavigate={{this.close}} />
          <TagFilter class="mt-10" />
        </div>
      </d.Body>
      <d.Footer>
        <Button
          @variant="custom"
          @onPress={{this.showPosts}}
          @class="w-full rounded-full bg-emerald-600 px-4 py-2.5 font-semibold text-white hover:bg-emerald-700"
          data-test-show-posts
        >
          Show
          {{this.matching}}
          {{if (eq this.matching 1) "adventure" "adventures"}}
        </Button>
      </d.Footer>
    </Drawer>
  </template>
}
