import { inline } from './facts.mjs';

/**
 * The `gear:` front matter of a post: what I had with me, and what I should
 * have had, with why.
 *
 *   gear:
 *     - item: Microspikes
 *       packed: true
 *     - item: Ice axe
 *       packed: false
 *       note: Nothing to stop a slide on the snowfield.   # Markdown
 *
 * Shown as a checklist after the story, or at a `<!-- gear -->` in it
 * (app/components/gear.gts), and in the feed; the note is rendered to HTML here.
 */
export function readGear(gear, path) {
  if (gear === undefined) return undefined;

  const fail = (message) => {
    throw new Error(`${path}: gear${message}`);
  };

  if (!Array.isArray(gear)) fail(' must be a list');

  return gear.map((entry, index) => {
    if (typeof entry?.item !== 'string' || !entry.item.trim()) {
      fail(`[${index}].item must be a name`);
    }
    if (typeof entry.packed !== 'boolean') {
      fail(`[${index}].packed must be true or false (${entry.item})`);
    }

    return {
      item: entry.item,
      packed: entry.packed,
      ...(entry.note !== undefined && { note: inline(String(entry.note)) }),
    };
  });
}

/**
 * The gear as an HTML list, for the feed.
 */
export function gearList(gear) {
  if (!gear?.length) return '';

  const items = gear
    .map(
      ({ item, packed, note }) =>
        `<li>${packed ? '✅' : '❌'} ${escape(item)}${note ? `: ${note}` : ''}</li>`,
    )
    .join('');

  return `<h2>The gear I had</h2><ul>${items}</ul>`;
}

/**
 * Where the gear checklist goes in a post: at a `<!-- gear -->` in its
 * Markdown, or after the story when there is none.
 */
export const GEAR_MARKER = /<!--\s*gear\s*-->/;

/**
 * The post's HTML with the gear list in its place, for the feed.
 */
export function withGear(html, gear) {
  const list = gearList(gear);

  return GEAR_MARKER.test(html)
    ? html.replace(GEAR_MARKER, () => list)
    : html + list;
}

function escape(text) {
  return text.replace(/&/g, '&amp;').replace(/</g, '&lt;');
}
