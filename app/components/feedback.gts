import site from '../../site.mjs';

import type { TOC } from '@ember/component/template-only';
import type { Post } from '../content/schemas.ts';

// RFC 6068: line breaks in a mailto: body are CRLF
const BREAK = '\r\n';

/**
 * A mailto: link with the subject and a first line already written, so a
 * reader only has to fill in their note.
 */
export const mailto = (post: Pick<Post, 'id' | 'title'>) => {
  const body = [
    'Hey Míša,',
    '',
    `I read your article "${post.title}" (${site.host}/${post.id}) and I wanted to say:`,
    '',
    '[fill in your text here]',
    '',
  ].join(BREAK);

  return `mailto:${site.email}?subject=${encodeURIComponent(post.title)}&body=${encodeURIComponent(body)}`;
};

/**
 * Instead of comments, which would need storing somewhere: a button that
 * opens the reader's email app with a note to me about the post.
 */
export const Feedback: TOC<{
  Element: HTMLElement;
  Args: { post: Post };
}> = <template>
  <aside
    class="flex flex-col items-center gap-3 rounded-2xl bg-emerald-50 px-6 py-8 text-center"
    data-test-feedback
    ...attributes
  >
    <a
      href={{mailto @post}}
      class="inline-flex items-center gap-2.5 rounded-full bg-emerald-600 px-5 py-2.5 font-semibold text-white shadow-sm hover:bg-emerald-700"
      data-test-feedback-link
    >
      <svg
        class="size-5"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        aria-hidden="true"
      >
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <path d="m3 7 9 6 9-6" />
      </svg>
      Send me a note
    </a>
    <p class="text-sm text-slate-600">It opens your email app, with the article
      already in it.</p>
  </aside>
</template>;
