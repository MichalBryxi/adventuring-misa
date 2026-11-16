import type { TOC } from '@ember/component/template-only';

/**
 * A mountain ridge line along the top of the page, where Transmit had its
 * audio waveform. Purely decorative.
 */
const RIDGE =
  'M0 70 L60 52 L95 60 L150 30 L190 46 L240 18 L285 40 L330 34 L380 8 L430 38 L470 28 L520 48 L575 22 L620 40 L680 14 L730 44 L780 36 L830 54 L890 26 L940 42 L1000 32 L1000 80 L0 80 Z';

export const Ridge: TOC<{ Element: SVGSVGElement }> = <template>
  <svg
    aria-hidden="true"
    viewBox="0 0 1000 80"
    preserveAspectRatio="none"
    ...attributes
  >
    <defs>
      <linearGradient id="ridge-gradient" x1="0" x2="1">
        <stop offset="0%" stop-color="#6ee7b7" />
        <stop offset="50%" stop-color="#7dd3fc" />
        <stop offset="100%" stop-color="#c4b5fd" />
      </linearGradient>
    </defs>
    <path d={{RIDGE}} fill="url(#ridge-gradient)" opacity="0.35" />
  </svg>
</template>;
