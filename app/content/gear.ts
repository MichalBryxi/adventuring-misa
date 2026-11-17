import { GEAR_MARKER } from '../../lib/gear.mjs';

/**
 * A post's HTML split where its gear checklist goes: at a `<!-- gear -->` in
 * the Markdown, or after the story when there is none (lib/gear.mjs).
 */
export function splitAtGear(html = ''): { before: string; after: string } {
  const [before = '', after = ''] = html.split(GEAR_MARKER);

  return { before, after };
}
