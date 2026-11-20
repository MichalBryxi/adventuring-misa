import { LinkTo } from '@ember/routing';

import { ResponsiveImage } from '@responsive-image/ember';
import { PortalTarget } from 'frontile/overlays';
import { pageTitle } from 'ember-page-title';

import site from '../../site.mjs';
import cover from '../../content/cover.jpg?responsive';
import { Explore } from '../components/explore.gts';
import { MobileNav } from '../components/mobile-nav.gts';
import { Ridge } from '../components/ridge.gts';
import { TagFilter } from '../components/tag-filter.gts';

<template>
  {{pageTitle site.title separator=" - "}}

  <div class="w-full">
    <MobileNav />

    {{! The sidebar, from lg up; below it, MobileNav's drawer has its content }}
    <header
      class="hidden bg-slate-50 lg:fixed lg:inset-y-0 lg:left-0 lg:flex lg:w-md lg:items-start lg:overflow-y-auto xl:w-120"
    >
      <div
        class="sticky top-0 flex w-16 flex-none items-center px-12 text-sm/7 whitespace-nowrap [writing-mode:vertical-rl]"
      >
        <span class="font-mono text-slate-500">Written by</span>
        <LinkTo
          @route="about-me"
          class="mt-6 font-bold text-slate-900 hover:text-emerald-700"
          data-test-owner
        >{{site.owner}}</LinkTo>
      </div>
      <div
        class="relative z-10 min-h-full flex-auto border-x border-slate-200 px-8 py-12 xl:px-12"
      >
        <LinkTo
          @route="index"
          class="relative block overflow-hidden rounded-2xl bg-slate-200 shadow-xl shadow-slate-200"
          aria-label="Homepage"
        >
          <ResponsiveImage
            @src={{cover}}
            @sizes="(min-width: 1280px) 24rem, 20rem"
            alt=""
            loading="eager"
            class="aspect-square object-cover"
          />
          <div
            class="absolute inset-0 rounded-2xl ring-1 ring-black/10 ring-inset"
          ></div>
        </LinkTo>
        <div class="mt-12">
          <p class="text-xl font-bold text-slate-900">
            <LinkTo @route="index">{{site.title}}</LinkTo>
          </p>
          <p class="mt-3 text-xs/5 font-medium text-slate-600">
            {{site.description}}
          </p>
        </div>
        <Explore class="mt-12" />
        <TagFilter class="mt-12" />
      </div>
    </header>

    <main class="relative lg:ml-112 xl:ml-120">
      <Ridge class="absolute top-0 left-0 h-20 w-full" />
      <div class="relative">
        {{outlet}}
      </div>
    </main>

    <footer
      class="border-t border-slate-200 bg-slate-50 py-10 sm:py-16 lg:hidden"
    >
      <div class="mx-auto px-4 sm:px-6 md:max-w-2xl md:px-4">
        <p class="font-mono text-sm/7 text-slate-500">
          Written by
          <LinkTo
            @route="about-me"
            class="font-bold text-slate-900 hover:text-emerald-700"
            data-test-owner
          >{{site.owner}}</LinkTo>
        </p>
      </div>
    </footer>
  </div>

  <PortalTarget class="relative z-40" />
</template>
