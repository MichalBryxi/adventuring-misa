import type { Facts } from './schemas.ts';

export type PostMeta = { id: string; tags?: string[]; facts?: Facts };

// A draft's meta is null in a build (lib/vite-plugin-blog.mjs)
const POSTS = Object.values(
  import.meta.glob<PostMeta | null>('@content/posts/*/index.md', {
    query: '?meta',
    import: 'default',
    eager: true,
  }),
).filter((post) => post !== null);

const hours = (time: string) => {
  const [h = 0, m = 0, s = 0] = time.split(':').map(Number);

  return h + m / 60 + s / 3600;
};

/**
 * The numbers in `facts:` that the front page can be filtered by, as tags
 * that aren't in the front matter: `ascent/over-1500m` is every post with
 * more than 1500 m of ascent.
 */
const DIMENSIONS = [
  { group: 'ascent', unit: 'm', of: (facts: Facts) => facts.ascent },
  { group: 'distance', unit: 'km', of: (facts: Facts) => facts.distance },
  {
    group: 'time',
    unit: 'h',
    of: (facts: Facts) => {
      const time = facts.duration ?? facts.movingTime;

      return time === undefined ? undefined : hours(time);
    },
  },
];

// Round numbers: 1, 1.5, 2, 3, 5, 10, 15, 20, 30, 50, 100, …
const STEPS = [1, 1.5, 2, 3, 5];

/**
 * The biggest round number below the value.
 */
function roundBelow(value: number) {
  for (let scale = 10 ** Math.floor(Math.log10(value)); ; scale /= 10) {
    for (const step of [...STEPS].reverse()) {
      const limit = Number((step * scale).toPrecision(6));

      if (limit < value) return limit;
    }
  }
}

const MAX_LIMITS = 5;

/**
 * The limits of a group come from the posts: for every post the round
 * number just below its value, so each limit is close to a real post. The
 * smallest is below every post, so it filters nothing out and goes. Then,
 * while there are too many, the limit with the fewest posts up to the next
 * one merges into the one below it.
 */
function limitsOf(values: number[]) {
  let limits = [...new Set(values.map(roundBelow))]
    .sort((a, b) => a - b)
    .slice(1);

  const postsFrom = (index: number) =>
    values.filter(
      (value) =>
        value > limits[index]! &&
        (index === limits.length - 1 || value <= limits[index + 1]!),
    ).length;

  while (limits.length > MAX_LIMITS) {
    let fewest = 0;

    for (let index = 1; index < limits.length; index++) {
      if (postsFrom(index) < postsFrom(fewest)) fewest = index;
    }

    limits = limits.filter((_, index) => index !== fewest);
  }

  return limits;
}

const LIMITS = new Map(
  DIMENSIONS.map(({ group, of }) => [
    group,
    limitsOf(
      POSTS.map((post) => post.facts && of(post.facts)).filter(
        (value): value is number => value !== undefined && value > 0,
      ),
    ),
  ]),
);

const FACT_TAG = /^(ascent|distance|time)\/over-([\d.]+)(?:m|km|h)$/;

/**
 * The limits a post is over: all of them from the round number below its
 * value down, as "over 1500 m" holds for "over 2000 m" too.
 */
function factTags(facts: Facts | undefined): string[] {
  if (!facts) return [];

  return DIMENSIONS.flatMap(({ group, unit, of }) => {
    const value = of(facts);

    if (value === undefined) return [];

    return LIMITS.get(group)!
      .filter((limit) => value > limit)
      .map((limit) => `${group}/over-${limit}${unit}`);
  });
}

/**
 * A post's tags from the front matter, and the ones from its facts.
 */
export const tagsOf = (post: PostMeta) => [
  ...(post.tags ?? []),
  ...factTags(post.facts),
];

/**
 * The limit of a fact tag (1500 for ascent/over-1500m), for its name and
 * its order; undefined for any other tag.
 */
export function factLimit(id: string): number | undefined {
  const match = FACT_TAG.exec(id);

  return match ? Number(match[2]) : undefined;
}

/**
 * The translation key of a fact tag's name: one for the group, which takes
 * the limit (`tag.ascent/over`: "> {value} m").
 */
export function factKey(id: string): string | undefined {
  const match = FACT_TAG.exec(id);

  return match ? `tag.${match[1]}/over` : undefined;
}
