import { LinkTo } from '@ember/routing';

import { ResponsiveImage } from '@responsive-image/ember';
import { pageTitle } from 'ember-page-title';

import site from '../../site.mjs';
import cover from '../../content/cover.jpg?responsive';
import { Ridge } from '../components/ridge.gts';

import type { TOC } from '@ember/component/template-only';

const About: TOC<{ Element: HTMLElement }> = <template>
  <section ...attributes>
    <h2
      class="flex items-center font-mono text-sm/7 font-medium text-slate-900"
    >
      <span class="h-2.5 w-2.5 rounded-full bg-emerald-300"></span>
      <span class="ml-2.5">About</span>
    </h2>
    <p class="mt-2 text-base/7 text-slate-700">{{site.about}}</p>
  </section>
</template>;

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
      class="mt-4 flex flex-wrap justify-center gap-x-8 gap-y-2 text-base/7 font-medium text-slate-700 lg:flex-col lg:gap-4"
    >
      {{#each site.navigation as |item|}}
        <li class="flex">
          <LinkTo
            @route={{item.route}}
            @model={{item.id}}
            class="hover:text-slate-900"
          >{{item.label}}</LinkTo>
        </li>
      {{/each}}
      <li class="flex">
        <a href="/rss.xml" class="hover:text-slate-900">RSS feed</a>
      </li>
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
        <span class="mt-6 font-bold text-slate-900">{{site.owner}}</span>
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
          <p class="mt-3 text-lg/8 font-medium text-slate-700">
            {{site.description}}
          </p>
        </div>
        <About class="mt-12 hidden lg:block" />
        <Explore class="mt-10 lg:mt-12" />
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
        <About />
        <p class="mt-8 font-mono text-sm/7 text-slate-500">
          Written by
          <span class="font-bold text-slate-900">{{site.owner}}</span>
        </p>
      </div>
    </footer>
  </div>
</template>
