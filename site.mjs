/**
 * Read by the app and by the build (RSS feed), so that both describe the same site.
 */
export default {
  title: 'Adventuring Míša',
  description:
    '🪂\u00a0Paragliding · ⛰️🏃‍♂️\u00a0Running · 🧗‍♂️\u00a0Climbing · 🚴‍♂️\u00a0Biking · ⛷️\u00a0Skiing · 🌱\u00a0Vegan',
  host: 'https://adventuring-misa.pudr.com',
  // Whose blog it is, in the sidebar
  owner: 'Michal Bryxí',
  // Where the "Send me a note" button under a post writes to
  email: 'michal.bryxi@gmail.com',
  /** @type {{ label: string; route: string; id?: string }[]} */
  navigation: [
    { label: 'About me', route: 'about-me' },
    { label: 'Changelog', route: 'changelog' },
  ],
};
