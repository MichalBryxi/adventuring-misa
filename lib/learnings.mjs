import { inline } from './facts.mjs';

/**
 * The `learnings:` front matter of a post: what I did right, and what I did
 * wrong, with why.
 *
 *   learnings:
 *     - text: Microspikes
 *       good: true
 *     - text: No ice axe
 *       good: false
 *       note: Nothing to stop a slide on the snowfield.   # Markdown
 *
 * Shown as a checklist after the story, or at a `<!-- learnings -->` in it
 * (app/components/learnings.gts), and in the feed; the note is rendered to
 * HTML here.
 */
export function readLearnings(learnings, path) {
  if (learnings === undefined) return undefined;

  const fail = (message) => {
    throw new Error(`${path}: learnings${message}`);
  };

  if (!Array.isArray(learnings)) fail(' must be a list');

  return learnings.map((entry, index) => {
    if (typeof entry?.text !== 'string' || !entry.text.trim()) {
      fail(`[${index}].text must be a sentence`);
    }
    if (typeof entry.good !== 'boolean') {
      fail(`[${index}].good must be true or false (${entry.text})`);
    }

    return {
      text: entry.text,
      good: entry.good,
      ...(entry.note !== undefined && { note: inline(String(entry.note)) }),
    };
  });
}

/**
 * The learnings as an HTML list, for the feed.
 */
export function learningsList(learnings) {
  if (!learnings?.length) return '';

  const items = learnings
    .map(
      ({ text, good, note }) =>
        `<li>${good ? '✅' : '❌'} ${escape(text)}${note ? `: ${note}` : ''}</li>`,
    )
    .join('');

  return `<h2>Learnings</h2><ul>${items}</ul>`;
}

/**
 * Where the learnings checklist goes in a post: at a `<!-- learnings -->` in
 * its Markdown, or after the story when there is none.
 */
export const LEARNINGS_MARKER = /<!--\s*learnings\s*-->/;

/**
 * The post's HTML with the learnings list in its place, for the feed.
 */
export function withLearnings(html, learnings) {
  const list = learningsList(learnings);

  return LEARNINGS_MARKER.test(html)
    ? html.replace(LEARNINGS_MARKER, () => list)
    : html + list;
}

function escape(text) {
  return text.replace(/&/g, '&amp;').replace(/</g, '&lt;');
}
