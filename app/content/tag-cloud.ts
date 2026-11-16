type Meta = { id: string; name?: string; parent?: string; tags?: string[] };

const POSTS = import.meta.glob<Meta>('/content/posts/*/index.md', {
  query: '?meta',
  import: 'default',
  eager: true,
});

const TAGS = new Map(
  Object.values(
    import.meta.glob<Meta>('/content/tags/*.md', {
      query: '?meta',
      import: 'default',
      eager: true,
    }),
  ).map((tag) => [tag.id, tag]),
);

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

export interface TagGroup {
  id: string;
  name: string;
  tags: CloudTag[];
}

export const tagName = (id: string) => TAGS.get(id)?.name ?? id;

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

for (const post of Object.values(POSTS)) {
  for (const tag of post.tags ?? []) {
    counts.set(tag, (counts.get(tag) ?? 0) + 1);
  }
}

// A tag with a parent (`parent:` in its file) is shown in that group
const parentOf = (id: string) => TAGS.get(id)?.parent;
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
  .map((id) => ({
    id,
    name: tagName(id),
    count: counts.get(id)!,
    size: sizeOf(counts.get(id)!),
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

/**
 * The tags that have a parent, under it, by name: one colour and size a
 * group, as they are values of one thing (★★★★★ … ★☆☆☆☆).
 */
export const TAG_GROUPS: TagGroup[] = [
  ...new Set(used.map(parentOf).filter((id) => id !== undefined)),
]
  .sort((a, b) => tagName(a).localeCompare(tagName(b)))
  .map((parent, index) => ({
    id: parent,
    name: tagName(parent),
    tags: used
      .filter((id) => parentOf(id) === parent)
      .map((id) => ({
        id,
        name: tagName(id),
        count: counts.get(id)!,
        size: 'text-sm',
        colour: COLOURS[(index + 2) % COLOURS.length]!,
      }))
      .sort((a, b) => a.name.localeCompare(b.name)),
  }));
