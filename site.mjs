/**
 * Read by the app and by the build (RSS feed), so that both describe the same site.
 */
export default {
  title: 'Adventuring Míša',
  description:
    '🪂 Paragliding · ⛰️🏃‍♂️ Trail Running · 🧗‍♂️ Climbing · 🚴‍♂️ Biking · ⛷️ Skiing · 🌱 Vegan',
  host: 'https://adventuring-misa.pudr.com',
  // Whose blog it is, in the sidebar
  owner: 'Michal Bryxí',
  about:
    'Trail running, hiking, T6 scrambles, Munros, paragliding and the gear that goes with them. Mostly in Switzerland, sometimes in Scotland.',
  navigation: [
    { label: 'Munros', route: 'tag', id: 'munro' },
    { label: 'Type 3 fun', route: 'tag', id: 'type-3-fun' },
    { label: 'About me', route: 'about-me' },
  ],
};
