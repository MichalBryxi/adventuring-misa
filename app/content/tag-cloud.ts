type Meta = { id: string; name?: string; tags?: string[] };

const POSTS = import.meta.glob<Meta>('/content/posts/*/index.md', {
  query: '?meta',
  import: 'default',
  eager: true,
});

const TAGS = import.meta.glob<Meta>('/content/tags/*.md', {
  query: '?meta',
  import: 'default',
  eager: true,
});

// The star ratings of reviews are tags too, but not topics to explore
const RATING = /^\d-stars?$/;

// Smallest to biggest
const SIZES = ['text-xs', 'text-sm', 'text-base', 'text-lg', 'text-xl'];

// The accents of the section headings, dark enough to read as text
const COLOURS = [
  'text-emerald-600',
  'text-sky-600',
  'text-amber-600',
  'text-rose-600',
  'text-violet-600',
];

export interface CloudTag {
  id: string;
  name: string;
  count: number;
  size: string;
  colour: string;
}

/**
 * Every tag used by a post, sized by how many posts use it, each in the next
 * colour. Like a word cloud, the biggest are in the middle and the smaller
 * ones fan out to both sides.
 */
export const TAG_CLOUD: CloudTag[] = (() => {
  const counts = new Map<string, number>();

  for (const post of Object.values(POSTS)) {
    for (const tag of post.tags ?? []) {
      if (!RATING.test(tag)) counts.set(tag, (counts.get(tag) ?? 0) + 1);
    }
  }

  const names = new Map(
    Object.values(TAGS).map((tag) => [tag.id, tag.name ?? tag.id]),
  );
  const values = [...counts.values()];
  const min = Math.min(...values);
  const max = Math.max(...values);

  return [...counts]
    .map(([id, count]) => ({
      id,
      name: names.get(id) ?? id,
      count,
      size: SIZES[
        max === min
          ? 2
          : Math.round(((count - min) / (max - min)) * (SIZES.length - 1))
      ]!,
    }))
    .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name))
    .reduce<Omit<CloudTag, 'colour'>[]>(
      (cloud, tag, index) => (index % 2 ? [tag, ...cloud] : [...cloud, tag]),
      [],
    )
    .map((tag, index) => ({
      ...tag,
      colour: COLOURS[index % COLOURS.length]!,
    }));
})();
