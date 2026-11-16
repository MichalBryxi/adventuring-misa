import { array } from '@ember/helper';
import { LinkTo } from '@ember/routing';

import { ResponsiveImage } from '@responsive-image/ember';
import { pageTitle } from 'ember-page-title';

import site from '../../site.mjs';
import cover from '../../content/cover.jpg?responsive';
import { Ridge } from '../components/ridge.gts';
import { TAG_CLOUD } from '../content/tag-cloud.ts';

import type { TOC } from '@ember/component/template-only';

const eq = (a: unknown, b: unknown) => a === b;

const Explore: TOC<{ Element: HTMLElement }> = <template>
  <section ...attributes>
    <h2
      class="sr-only flex items-center font-mono text-sm/7 font-medium text-slate-900 lg:not-sr-only"
    >
      <span class="h-2.5 w-2.5 rounded-full bg-sky-300"></span>
      <span class="ml-2.5">Explore</span>
    </h2>
    <div
      class="h-px bg-linear-to-r from-slate-200/0 via-slate-200 to-slate-200/0 lg:hidden"
    ></div>
    <ul
      role="list"
      class="mt-4 flex flex-wrap justify-center gap-x-8 gap-y-2 text-base/7 font-semibold text-slate-900 lg:flex-col lg:gap-3"
    >
      {{#each site.navigation as |item|}}
        <li class="flex items-center gap-2">
          <span class="text-sky-500" aria-hidden="true">→</span>
          <LinkTo
            @route={{item.route}}
            @models={{if item.id (array item.id) (array)}}
            class="hover:text-emerald-700"
          >{{item.label}}</LinkTo>
        </li>
      {{/each}}
      <li class="flex items-center gap-2">
        <span class="text-sky-500" aria-hidden="true">→</span>
        <a href="/rss.xml" class="hover:text-emerald-700">RSS feed</a>
      </li>
    </ul>
  </section>
</template>;

const Tags: TOC<{ Element: HTMLElement }> = <template>
  <section ...attributes>
    <h2
      class="flex items-center justify-center font-mono text-sm/7 font-medium text-slate-900 lg:justify-start"
    >
      <span class="h-2.5 w-2.5 rounded-full bg-amber-300"></span>
      <span class="ml-2.5">Tags</span>
    </h2>
    <ul
      role="list"
      class="mt-4 flex flex-wrap items-center justify-center gap-x-2.5 gap-y-1 leading-none font-medium"
      data-test-tag-cloud
    >
      {{#each TAG_CLOUD as |tag|}}
        <li>
          <LinkTo
            @route="tag"
            @model={{tag.id}}
            class="{{tag.size}} {{tag.colour}} hover:underline"
            title="{{tag.count}} {{if (eq tag.count 1) 'post' 'posts'}}"
            data-test-cloud-tag={{tag.id}}
          >{{tag.name}}</LinkTo>
        </li>
      {{/each}}
    </ul>
  </section>
</template>;

<template>
  {{pageTitle site.title separator=" – "}}

  <div class="w-full">
    <header
      class="bg-slate-50 lg:fixed lg:inset-y-0 lg:left-0 lg:flex lg:w-md lg:items-start lg:overflow-y-auto xl:w-120"
    >
      <div
        class="hidden lg:sticky lg:top-0 lg:flex lg:w-16 lg:flex-none lg:items-center lg:px-12 lg:text-sm/7 lg:whitespace-nowrap lg:[writing-mode:vertical-rl]"
      >
        <span class="font-mono text-slate-500">Written by</span>
        <LinkTo
          @route="about-me"
          class="mt-6 font-bold text-slate-900 hover:text-emerald-700"
          data-test-owner
        >{{site.owner}}</LinkTo>
      </div>
      <div
        class="relative z-10 mx-auto px-4 pt-10 pb-4 sm:px-6 md:max-w-2xl md:px-4 lg:min-h-full lg:flex-auto lg:border-x lg:border-slate-200 lg:px-8 lg:py-12 xl:px-12"
      >
        <LinkTo
          @route="index"
          class="relative mx-auto block w-48 overflow-hidden rounded-lg bg-slate-200 shadow-xl shadow-slate-200 sm:w-64 sm:rounded-xl lg:w-auto lg:rounded-2xl"
          aria-label="Homepage"
        >
          <ResponsiveImage
            @src={{cover}}
            @sizes="(min-width: 1280px) 24rem, (min-width: 1024px) 20rem, (min-width: 640px) 16rem, 12rem"
            alt=""
            loading="eager"
            class="aspect-square object-cover"
          />
          <div
            class="absolute inset-0 rounded-lg ring-1 ring-black/10 ring-inset sm:rounded-xl lg:rounded-2xl"
          ></div>
        </LinkTo>
        <div class="mt-10 text-center lg:mt-12 lg:text-left">
          <p class="text-xl font-bold text-slate-900">
            <LinkTo @route="index">{{site.title}}</LinkTo>
          </p>
          <p class="mt-3 text-xs/5 font-medium text-slate-600">
            {{site.description}}
          </p>
        </div>
        <Explore class="mt-10 lg:mt-12" />
        <Tags class="mt-10 lg:mt-12" />
      </div>
    </header>

    <main
      class="border-t border-slate-200 lg:relative lg:ml-112 lg:border-t-0 xl:ml-120"
    >
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
</template>
