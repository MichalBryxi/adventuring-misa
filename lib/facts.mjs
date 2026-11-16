import rehypeStringify from 'rehype-stringify';
import remarkGfm from 'remark-gfm';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import { unified } from 'unified';

/**
 * The `facts:` front matter of a post: the numbers worth filtering and
 * sorting by, plus anything else as free-form rows.
 *
 *   facts:
 *     date: 2024-06-25        # when it happened, if not the post's date
 *     location: "[Stechelberg](https://…)"
 *     grade: T6
 *     points:                 # places on the way, in order
 *       - name: Stechelberg
 *         altitude: 910       # m, optional
 *         link: https://…     # optional
 *     distance: 13.8          # km
 *     ascent: 1820            # m
 *     duration: "5:36"        # h:mm or h:mm:ss; or movingTime
 *     more:                   # label: Markdown, in this order
 *       Destination: Silberhornhütte, 2663 m
 *     links:                  # label: URL
 *       Strava: https://…
 *
 * Becomes the typed values plus `rows`, the table rendered before the post
 * (app/components/facts.gts) and in the feed, so both read the same.
 */
export function readFacts(facts, path) {
  if (facts === undefined) return undefined;

  const fail = (message) => {
    throw new Error(`${path}: facts.${message}`);
  };

  if (typeof facts !== 'object' || facts === null || Array.isArray(facts)) {
    fail(' must be a map');
  }

  const known = new Set([...Object.keys(LABELS), 'more', 'links']);

  for (const key of Object.keys(facts)) {
    if (!known.has(key)) fail(`${key} is not a known fact, put it under more:`);
  }

  for (const key of ['distance', 'ascent']) {
    if (facts[key] !== undefined && typeof facts[key] !== 'number') {
      fail(`${key} must be a plain number, got ${JSON.stringify(facts[key])}`);
    }
  }

  for (const key of ['duration', 'movingTime']) {
    if (facts[key] !== undefined && !TIME.test(String(facts[key]))) {
      fail(`${key} must be h:mm or h:mm:ss, got ${JSON.stringify(facts[key])}`);
    }
  }

  const date = facts.date === undefined ? undefined : String(facts.date);

  if (date !== undefined && Number.isNaN(Date.parse(date))) {
    fail(`date must be YYYY-MM-DD, got ${JSON.stringify(facts.date)}`);
  }

  const points = readPoints(facts.points, fail);

  const values = {
    date,
    points,
    grade: facts.grade === undefined ? undefined : String(facts.grade),
    distance: facts.distance,
    ascent: facts.ascent,
    duration: facts.duration === undefined ? undefined : String(facts.duration),
    movingTime:
      facts.movingTime === undefined ? undefined : String(facts.movingTime),
  };

  const rows = [
    values.date && [LABELS.date, escape(formatDate(values.date))],
    facts.location !== undefined && [
      LABELS.location,
      inline(String(facts.location)),
    ],
    values.grade && [LABELS.grade, formatGrade(values.grade)],
    points && [LABELS.points, formatPoints(points)],
    values.distance !== undefined && [
      LABELS.distance,
      `${formatNumber(values.distance)} km`,
    ],
    values.ascent !== undefined && [
      LABELS.ascent,
      `${formatNumber(values.ascent)} m`,
    ],
    values.duration && [LABELS.duration, formatTime(values.duration)],
    values.movingTime && [LABELS.movingTime, formatTime(values.movingTime)],
    ...Object.entries(facts.more ?? {}).map(([label, value]) => [
      escape(label),
      inline(String(value)),
    ]),
    Object.keys(facts.links ?? {}).length && [
      'Links',
      Object.entries(facts.links)
        .map(([label, url]) => `<a href="${escape(url)}">${escape(label)}</a>`)
        .join(' · '),
    ],
  ]
    .filter(Boolean)
    .map(([label, html]) => ({ label, html }));

  return Object.fromEntries(
    Object.entries({ ...values, rows }).filter(
      ([, value]) => value !== undefined,
    ),
  );
}

/**
 * The facts as an HTML table, for the feed.
 */
export function factsTable(facts) {
  if (!facts?.rows.length) return '';

  const rows = facts.rows
    .map(({ label, html }) => `<tr><th>${label}</th><td>${html}</td></tr>`)
    .join('');

  return `<table>${rows}</table>`;
}

const LABELS = {
  date: 'Date',
  location: 'Location',
  grade: 'Grade',
  points: 'Points',
  distance: 'Distance',
  ascent: 'Ascent',
  duration: 'Duration',
  movingTime: 'Moving time',
};

const TIME = /^\d+:\d{2}(:\d{2})?$/;

function readPoints(points, fail) {
  if (points === undefined) return undefined;
  if (!Array.isArray(points)) fail('points must be a list');

  return points.map((point, index) => {
    if (typeof point?.name !== 'string' || !point.name.trim()) {
      fail(`points[${index}].name must be a name`);
    }
    if (point.altitude !== undefined && typeof point.altitude !== 'number') {
      fail(`points[${index}].altitude must be a plain number (${point.name})`);
    }
    if (point.link !== undefined && !/^https?:\/\//.test(point.link)) {
      fail(`points[${index}].link must be a URL (${point.name})`);
    }

    const unknown = Object.keys(point).filter(
      (key) => !['name', 'altitude', 'link'].includes(key),
    );

    if (unknown.length) fail(`points[${index}] has unknown ${unknown}`);

    return point;
  });
}

// Stechelberg (910 m) → Silberhornhütte (2,663 m)
function formatPoints(points) {
  return points
    .map(({ name, altitude, link }) => {
      const label = link
        ? `<a href="${escape(link)}">${escape(name)}</a>`
        : escape(name);

      return altitude === undefined
        ? label
        : `${label} (${formatNumber(altitude)} m)`;
    })
    .join(' → ');
}

function formatDate(date) {
  return new Date(date).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  });
}

// SAC hiking grades link to the scale
function formatGrade(grade) {
  return /^T[1-6][+-]?$/.test(grade)
    ? `<a href="${SAC_SCALE}">${grade}</a>`
    : inline(grade);
}

const SAC_SCALE = 'https://de.wikipedia.org/wiki/SAC-Wanderskala';

function formatNumber(number) {
  return number.toLocaleString('en-GB');
}

// 5:36 → 5 h 36 min; race times keep their seconds: 1:17:31
function formatTime(time) {
  const [hours, minutes, seconds] = time.split(':');

  return seconds === undefined
    ? `${Number(hours)} h ${Number(minutes)} min`
    : time;
}

function escape(text) {
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

const inlineProcessor = unified()
  .use(remarkParse)
  .use(remarkGfm)
  .use(remarkRehype)
  .use(rehypeStringify)
  .freeze();

// Markdown of a table cell: links and emphasis, without the paragraph
export function inline(markdown) {
  return String(inlineProcessor.processSync(markdown))
    .trim()
    .replace(/^<p>([\s\S]*)<\/p>$/, '$1');
}
