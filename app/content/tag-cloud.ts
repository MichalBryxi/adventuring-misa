type Meta = { id: string; tags?: string[] };

const POSTS = import.meta.glob<Meta>('/content/posts/*/index.md', {
  query: '?meta',
  import: 'default',
  eager: true,
});

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
  count: number;
  size: string;
  colour: string;
}

export interface TagGroup {
  id: string;
  tags: CloudTag[];
}

/**
 * The translation key of a tag's name (translations/en-us.json).
 */
export const tagKey = (id: string) => `tag.${id}`;

const POST_TAGS = Object.values(POSTS).map((post) => post.tags ?? []);

/**
 * Whether adding the tag to the filter would leave no posts: no post with
 * all the selected tags has it too.
 */
export const leadsNowhere = (selected: string[], id: string) =>
  !selected.includes(id) &&
  !POST_TAGS.some(
    (tags) => tags.includes(id) && selected.every((tag) => tags.includes(tag)),
  );

const counts = new Map<string, number>();

for (const tags of POST_TAGS) {
  for (const tag of tags) counts.set(tag, (counts.get(tag) ?? 0) + 1);
}

// rating/4-stars is in the group rating
const parentOf = (id: string) =>
  id.includes('/') ? id.slice(0, id.indexOf('/')) : undefined;
const used = [...counts.keys()];
const topLevel = used.filter((id) => !parentOf(id));
const values = topLevel.map((id) => counts.get(id)!);
const min = Math.min(...values);
const max = Math.max(...values);

const sizeOf = (count: number) =>
  SIZES[
    max === min
      ? 2
      : Math.round(((count - min) / (max - min)) * (SIZES.length - 1))
  ]!;

/**
 * Every top-level tag used by a post, sized by how many posts use it, each
 * in the next colour. Like a word cloud, the biggest are in the middle and
 * the smaller ones fan out to both sides.
 */
export const TAG_CLOUD: CloudTag[] = topLevel
  .map((id) => ({ id, count: counts.get(id)!, size: sizeOf(counts.get(id)!) }))
  .sort((a, b) => b.count - a.count || a.id.localeCompare(b.id))
  .reduce<Omit<CloudTag, 'colour'>[]>(
    (cloud, tag, index) => (index % 2 ? [tag, ...cloud] : [...cloud, tag]),
    [],
  )
  .map((tag, index) => ({
    ...tag,
    colour: COLOURS[index % COLOURS.length]!,
  }));

/**
 * The tags in a group (`group/value`), under it, highest value first: one
 * colour and size a group, as they are values of one thing (★★★★★ … ★☆☆☆☆).
 */
export const TAG_GROUPS: TagGroup[] = [
  ...new Set(used.map(parentOf).filter((id) => id !== undefined)),
]
  .sort()
  .map((parent, index) => ({
    id: parent,
    tags: used
      .filter((id) => parentOf(id) === parent)
      .sort((a, b) => b.localeCompare(a, 'en', { numeric: true }))
      .map((id) => ({
        id,
        count: counts.get(id)!,
        size: 'text-sm',
        colour: COLOURS[(index + 2) % COLOURS.length]!,
      })),
  }));
