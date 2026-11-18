import { LEARNINGS_MARKER } from '../../lib/learnings.mjs';

/**
 * A post's HTML split where its learnings checklist goes: at a
 * `<!-- learnings -->` in the Markdown, or after the story when there is none
 * (lib/learnings.mjs).
 */
export function splitAtLearnings(html = ''): {
  before: string;
  after: string;
} {
  const [before = '', after = ''] = html.split(LEARNINGS_MARKER);

  return { before, after };
}
