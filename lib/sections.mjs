import { inline } from './facts.mjs';

/**
 * The `sections:` front matter of a page: blocks of items shown after the
 * page's text (app/components/sections.gts).
 *
 *   sections:
 *     - title: Outdoors
 *       layout: cards          # cards, timeline or links
 *       items:
 *         - heading: Paragliding
 *           icon: 🪂           # optional
 *           date: 2024-02      # YYYY or YYYY-MM, optional; timeline
 *           link: https://…    # optional; required for links
 *           text: Solo pilot … # Markdown, optional
 *
 * The text is rendered to HTML here.
 */
export function readSections(sections, path) {
  if (sections === undefined) return undefined;

  const fail = (message) => {
    throw new Error(`${path}: sections${message}`);
  };

  if (!Array.isArray(sections)) fail(' must be a list');

  return sections.map((section, index) => {
    const at = `[${index}]`;

    if (typeof section?.title !== 'string' || !section.title.trim()) {
      fail(`${at}.title must be a title`);
    }
    if (!LAYOUTS.includes(section.layout)) {
      fail(`${at}.layout must be one of ${LAYOUTS.join(', ')}`);
    }
    if (!Array.isArray(section.items) || !section.items.length) {
      fail(`${at}.items must be a list (${section.title})`);
    }

    return {
      title: section.title,
      layout: section.layout,
      items: section.items.map((item, i) =>
        readItem(item, section.layout, (message) =>
          fail(`${at}.items[${i}]${message} (${section.title})`),
        ),
      ),
    };
  });
}

const LAYOUTS = ['cards', 'timeline', 'links'];
const KEYS = ['heading', 'icon', 'date', 'link', 'text'];
const DATE = /^\d{4}(-\d{2})?$/;

function readItem(item, layout, fail) {
  if (typeof item?.heading !== 'string' || !item.heading.trim()) {
    fail('.heading must be a heading');
  }

  const unknown = Object.keys(item).filter((key) => !KEYS.includes(key));

  if (unknown.length) fail(` has unknown ${unknown}`);

  // YAML reads 2024 as a number
  const date = item.date === undefined ? undefined : String(item.date);

  if (date !== undefined && !DATE.test(date)) {
    fail(`.date must be YYYY or YYYY-MM, got ${JSON.stringify(item.date)}`);
  }
  if (item.link !== undefined && !/^(https?:\/\/|\/)/.test(item.link)) {
    fail('.link must be a URL or a path');
  }
  if (layout === 'links' && item.link === undefined) fail('.link is missing');

  return {
    heading: item.heading,
    ...(item.icon !== undefined && { icon: String(item.icon) }),
    ...(date !== undefined && { date, dateLabel: formatDate(date) }),
    ...(item.link !== undefined && { link: item.link }),
    ...(item.text !== undefined && { html: inline(String(item.text)) }),
  };
}

// 2024-02 → Feb 2024
function formatDate(date) {
  const [year, month] = date.split('-');

  return month === undefined
    ? year
    : new Date(Date.UTC(Number(year), Number(month) - 1)).toLocaleDateString(
        'en-GB',
        { month: 'short', year: 'numeric', timeZone: 'UTC' },
      );
}
