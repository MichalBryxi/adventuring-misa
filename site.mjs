/**
 * Read by the app and by the build (RSS feed), so that both describe the same site.
 */
export default {
  title: 'Adventuring Míša',
  description: '🪂 + ⛰️🏃‍♂️ + 🧗‍♂️ + 🚴‍♂️ + ⛷️ + 🗺️ + 🌱',
  host: 'https://adventuring-misa.pudr.com',
  author: 'michal-bryxi',
  authorName: 'Michal Bryxí',
  about:
    'Trail running, hiking, T6 scrambles, Munros, paragliding and the gear that goes with them. Mostly in Switzerland, sometimes in Scotland.',
  navigation: [
    { label: 'Munros', route: 'tag', id: 'munro' },
    { label: 'Type 3 fun', route: 'tag', id: 'type-3-fun' },
    { label: 'About me', route: 'page', id: 'about-me' },
  ],
};
