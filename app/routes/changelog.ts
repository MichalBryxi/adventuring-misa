import Route from '@ember/routing/route';

// CHANGELOG.md, rendered by lib/vite-plugin-blog.mjs; its own chunk, loaded
// only on this page
const CHANGELOG = import.meta.glob<string>('/CHANGELOG.md', {
  import: 'default',
});

export default class ChangelogRoute extends Route {
  async model() {
    const html = await CHANGELOG['/CHANGELOG.md']!();

    // The page has its own h1, like the other pages
    return { html: html.replace(/^\s*<h1[^>]*>[\s\S]*?<\/h1>\s*/, '') };
  }
}
