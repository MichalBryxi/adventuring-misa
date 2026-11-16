/**
 * The tags the front page is filtered by, in its `tags` query parameter:
 * `/?tags=munro,4-stars` lists the posts that have all of them.
 */
export const SEPARATOR = ',';

export function selectedTags(param: string | undefined | null): string[] {
  return (param ?? '').split(SEPARATOR).filter(Boolean);
}

/**
 * The query parameter with the tag added, or removed if it's in already.
 * Empty when nothing is left, which Ember leaves out of the URL.
 */
export function toggleTag(selected: string[], tag: string): string {
  return (
    selected.includes(tag)
      ? selected.filter((id) => id !== tag)
      : [...selected, tag]
  ).join(SEPARATOR);
}
