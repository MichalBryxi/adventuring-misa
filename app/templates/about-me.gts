import { htmlSafe } from '@ember/template';

import { ResponsiveImage } from '@responsive-image/ember';
import { pageTitle } from 'ember-page-title';

import photo from '../../content/about-me.jpg?responsive';
import { Container } from '../components/container.gts';
import { Head } from '../components/head.gts';
import { Sections } from '../components/sections.gts';
import { PROSE_SIZES, photoUrl } from '../content/photo.ts';

import type { TOC } from '@ember/component/template-only';
import type { Section } from '../components/sections.gts';

// The About me page is one of a kind, so its content lives here as data
// rather than in content/. Text is HTML.

const TITLE = 'Michal Bryxí';

const INTRO = htmlSafe(
  `Hi, I'm Míša. I'm Czech and grew up in Pilsen, then lived in Belfast, Edinburgh and Inverness, and now I live in <a href="https://en.wikipedia.org/wiki/Interlaken">Interlaken</a>, between the lakes, with the Swiss Alps on the doorstep. This blog is where I write up my adventures in the mountains and things around.`,
);

const SECTIONS: Section[] = [
  {
    title: 'Outdoors',
    layout: 'cards',
    items: [
      {
        heading: 'Trail running',
        icon: '🏃',
        text: `Races up to 100 km: Baroko 100, Matterhorn Ultraks Extreme, E51, Ben Nevis Ultra, the <a href="/2019-09-21-salomon-ring-of-steall-skyrace">Ring of Steall</a>, the <a href="/2019-08-24-thieves-road-race">Thieves Road</a>, the <a href="/2019-08-03-tromso-skyrace-tromsdalstinden">Tromsø Skyrace</a>, the Niesen Treppenlauf and the Vertical Kilometre du Mont Blanc. All the race reports are under <a href="/?tags=race">race</a>.`,
      },
      {
        heading: 'Hiking and scrambling',
        icon: '🥾',
        text: `From <a href="/?tags=munro">Munros</a> in Scotland to <a href="/2024-06-25-katzenwegli-t6">T6 routes</a> in the Bernese Oberland.`,
      },
      {
        heading: 'Climbing',
        icon: '🧗',
        text: `A hobby climber up to 6b+, mostly sport, plus bouldering, multi-pitch and trad, and via ferratas up to D. I've introduced plenty of people to climbing and bouldering, and did the SAC course for setting boulder routes.`,
      },
      {
        heading: 'Paragliding',
        icon: '🪂',
        text: `Solo pilot (IPPI 4), flying in Switzerland, around Central Europe and in Nepal.`,
      },
      {
        heading: 'Skiing and ski touring',
        icon: '⛷️',
        text: `I taught myself to ski on the pistes a few years ago, and now I'm heading off them, ski touring for the freedom of the open Alps.`,
      },
      {
        heading: 'Biking',
        icon: '🚴',
        text: `Bikepacking from Czechia to the sea, from Havana to the westernmost point of Cuba, and along part of Ireland's Wild Atlantic Way. I'm an active <a href="https://www.warmshowers.org">Warmshowers</a> host, so if you're cycling through Interlaken, get in touch.`,
      },
      {
        heading: 'Guiding',
        icon: '🚵',
        text: `I've guided e-bike tours around Interlaken, for Loop Tours in 2024 and <a href="https://www.flyingwheels.ch">Flying Wheels</a> in 2025.`,
      },
    ],
  },
  {
    title: 'Courses & certificates',
    layout: 'timeline',
    items: [
      {
        heading: 'Powder skiing',
        icon: '⛷️',
        date: '2024-01',
        text: `At the <a href="https://www.coolschool.ch/">Cool School</a> in the Lötschental.`,
      },
      {
        heading: 'Basic avalanche training',
        icon: '🏔️',
        date: '2024-02',
        text: `With <a href="https://outdoor.ch">Outdoor+</a> on First.`,
      },
      {
        heading: 'First aid',
        icon: '🩹',
        date: '2024-04',
        text: `In Interlaken.`,
      },
      {
        heading: 'Boulder route setting',
        icon: '🧗',
        date: '2024-10',
        text: `The <a href="https://www.sac-cas.ch/de/leistungssport/sportklettern/routenbaukurse/">SAC course</a> in Yverdon-les-Bains.`,
      },
      {
        heading: 'Paragliding licence',
        icon: '🪂',
        text: `IPPI 4.`,
      },
    ],
  },
  {
    title: 'Vegan',
    layout: 'cards',
    items: [
      {
        heading: 'Vegan fondue',
        icon: '🫕',
        text: `Fondue is a Swiss mountain classic, and it works just as well without the cheese. I help put on vegan fondue evenings in the Bernese Oberland, with skiing first at the <a href="https://www.mountainhostel.com">Mountain Hostel</a> in Gimmelwald in January 2026, and next up the Heimwehfluh above Interlaken. Supported by <a href="https://newroots.ch">New Roots</a> and <a href="https://www.tier-im-fokus.ch">Tier im Fokus</a>.`,
      },
    ],
  },
  {
    title: 'Computers',
    layout: 'cards',
    items: [
      {
        heading: 'Beauty salons',
        icon: '💇',
        text: `<a href="https://beauty-pay.cz">beauty-pay.cz</a>, a booking and management app for beauty salons, which I've run for eleven years.`,
      },
      {
        heading: 'Paragliding weather',
        icon: '🌬️',
        text: `<a href="https://winds.mobi">winds.mobi</a> shows real-time wind from weather stations across the Alps and beyond, and paragliders check it before they fly. I build its <a href="https://github.com/winds-mobi/winds-mobi-client-web">new web client</a>.`,
      },
      {
        heading: 'Bikepacking weather',
        icon: '🌦️',
        text: `<a href="https://forkcast.vast.earth">Forkcast</a> shows what the weather usually does along a bike route, day by day, so you can plan a long trip months ahead.`,
      },
      {
        heading: 'Magic Pass on the map',
        icon: '🗺️',
        text: `<a href="/2023-05-10-magic-pass-places-as-gpx">Every Magic Pass place as a GPX</a>, so you can see on a map where the pass is valid.`,
      },
      {
        heading: 'Paragliding flight stats',
        icon: '📈',
        text: `<a href="https://gitlab.com/michal-bryxi/open-source/vario-skytraxx-to-csv">Vario Skytraxx to CSV</a> exports the statistics of paraglider and hang glider flights from a Skytraxx 2.0 vario.`,
      },
      {
        heading: 'Rental shop check-in',
        icon: '🧩',
        link: 'https://github.com/MichalBryxi/approom-customiser',
        text: `<a href="https://chromewebstore.google.com/detail/approom-customiser/nknnolnmhnmikpopfakfpmoggccciefb">AppRoom Customiser</a>, a Chrome extension that adds workflow helpers to the App-Room ERP: print buttons, barcode check-in and registration automation.`,
      },
      {
        heading: 'Poll to calendar',
        icon: '📅',
        text: `<a href="https://nuudel-to-ics.netlify.app">nuudel to ICS</a> turns a nuudel "Termin finden" poll into calendar files you can import anywhere.`,
      },
      {
        heading: 'Song flipbook',
        icon: '🎵',
        text: `<a href="https://spotify-flipbook.netlify.app">Spotify Flipbook</a> makes a printable flipbook from a Spotify playlist.`,
      },
      {
        heading: 'This blog',
        icon: '📝',
        link: 'https://github.com/MichalBryxi/adventuring-misa',
        text: `The website you're reading, built with Ember and Tailwind CSS. Its <a href="https://github.com/MichalBryxi/adventuring-misa">source code</a>, and the history of every change, are on GitHub.`,
      },
    ],
  },
  {
    title: 'Talks',
    layout: 'timeline',
    items: [
      {
        heading: 'Intro to Razor',
        icon: '🎤',
        date: '2015',
        link: 'https://drive.google.com/file/d/1y20VCkIx0N5OrE3G9VHUXvjVBtEdSNXr/view?usp=sharing',
        text: `At EurOpen.`,
      },
      {
        heading: 'GitHub tricks you should know',
        icon: '🎤',
        date: '2016',
        link: 'https://docs.google.com/presentation/d/1r8V1kr3T9Ot7ctQlkOf7895iKFSoqg_wFZPdpKeq01g/edit?usp=sharing',
        text: `At DevOpsDays Berlin.`,
      },
      {
        heading: 'Ember related goodness to blow our minds',
        icon: '🎤',
        date: '2017',
        link: 'https://docs.google.com/presentation/d/17GuQDFzFBBhk3clD77heYypoRHWpIzSKR37X8YCcfXM/edit?usp=sharing',
        text: `At BelfastJS.`,
      },
      {
        heading: 'Surprising a11y',
        icon: '🎤',
        date: '2018',
        link: 'https://docs.google.com/presentation/d/1RKmsvEUc96h9L9JFBEuxy8dZcYrHQBucT-igyzaPZeE/edit?usp=sharing',
        text: `At BelfastJS.`,
      },
      {
        heading: 'How to make a flawless software 101',
        icon: '🎤',
        date: '2020',
        link: 'https://docs.google.com/presentation/d/1T3CnBkWr_1viQQW5ELit5mRpkqgoEdGc4NlZZDYHOK0/edit?usp=sharing',
        text: `Remote.`,
      },
      {
        heading: "You're a contributor!",
        icon: '🎤',
        date: '2021',
        link: 'https://docs.google.com/presentation/d/1h5Ums3b_ljEa0dUqF8DRFcckvb-mFBzkWHd0DfGF1YU/edit?usp=sharing',
        text: `At EmberFest.`,
      },
      {
        heading: 'The case for consistency in 2022+ frontend apps',
        icon: '🎤',
        date: '2022',
        link: 'https://docs.google.com/presentation/d/1B1XjniRb-TOTEC5hcybS-H3TbMaVELrWFj5nVDqHXLY/edit?usp=sharing',
        text: `Remote.`,
      },
      {
        heading:
          '4,207 Days of Uptime: Evolving an Ember App Without a Rewrite',
        icon: '🎤',
        date: '2026',
        link: 'https://github.com/MichalBryxi/EmberFest-2026-Prague-4207-Days-of-Uptime',
        text: `At EmberFest in Prague: how a booking app for beauty salons has kept evolving in production for eleven years without ever being rewritten.`,
      },
    ],
  },
  {
    title: 'Find me',
    layout: 'links',
    items: [
      { heading: 'Strava', link: 'https://www.strava.com/athletes/14041018' },
      { heading: 'Mastodon', link: 'https://mastodon.world/@MichalBryxi' },
      { heading: 'GitHub', link: 'https://github.com/MichalBryxi' },
      { heading: 'LinkedIn', link: 'https://www.linkedin.com/in/michalbryxi' },
      {
        heading: 'Outdoor CV (PDF)',
        link: 'https://michalbryxi.github.io/2025/Michal_Bryxi_outdoor_CV.pdf',
      },
      {
        heading: 'IT CV (PDF)',
        link: 'https://michalbryxi.github.io/2026/Michal_Bryxi_CV.pdf',
      },
      { heading: 'RSS feed', link: '/rss.xml' },
    ],
  },
];

export default <template>
  {{pageTitle TITLE}}
  <Head @title={{TITLE}} @image={{photoUrl photo}} @path="/page/about-me" />

  <article class="py-16 lg:py-36" data-test-page="about-me">
    <Container>
      <h1 class="text-4xl font-bold text-slate-900">{{TITLE}}</h1>
      <ResponsiveImage
        @src={{photo}}
        @sizes={{PROSE_SIZES}}
        alt=""
        loading="eager"
        fetchpriority="high"
        class="mt-10 rounded-2xl shadow-xl shadow-slate-200"
      />
      <p
        class="mt-12 text-lg/8 text-slate-700 [&_a]:text-emerald-700 [&_a]:underline hover:[&_a]:text-emerald-900"
      >{{INTRO}}</p>
      <Sections @sections={{SECTIONS}} class="mt-16" />
    </Container>
  </article>
</template> satisfies TOC<{ Args: { model: unknown } }>;
