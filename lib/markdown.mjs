import { toString } from 'mdast-util-to-string';
import rehypeRaw from 'rehype-raw';
import rehypeSlug from 'rehype-slug';
import rehypeStringify from 'rehype-stringify';
import remarkFrontmatter from 'remark-frontmatter';
import remarkGfm from 'remark-gfm';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import { unified } from 'unified';
import { visit } from 'unist-util-visit';
import { VFile } from 'vfile';
import { matter } from 'vfile-matter';

const EXCERPT_WORDS = 33;

/**
 * Files that live next to the Markdown (`./01.jpg`, `./route.gpx`) and go
 * through the bundler. Relative links to other posts (`../2021-06-07-an-teallach`)
 * have no extension and stay as they are.
 */
const ASSET =
  /^\.{0,2}\/?[^:?#]+\.(jpe?g|png|webp|avif|gif|svg|gpx|kml|pdf|mp4)$/i;

export function isAsset(url) {
  return typeof url === 'string' && !url.startsWith('/') && ASSET.test(url);
}

const ASSET_ATTRIBUTES = { img: 'src', source: 'src', video: 'src', a: 'href' };

/**
 * Photos that get resized into several widths (lib/vite-plugin-blog.mjs).
 */
export function isPhoto(url) {
  return isAsset(url) && /\.(jpe?g|png|webp|avif)$/i.test(url);
}

/**
 * Hands every local file the document points to over to `resolveAsset`,
 * and writes back whatever it returns. `<img>` photos go to `resolveImage`
 * instead, when given.
 */
function rehypeAssets({ resolveAsset, resolveImage = resolveAsset }) {
  return (tree) => {
    visit(tree, 'element', (node) => {
      const attribute = ASSET_ATTRIBUTES[node.tagName];
      const url = attribute && node.properties[attribute];

      if (!isAsset(url)) return;

      node.properties[attribute] =
        node.tagName === 'img' && isPhoto(url)
          ? resolveImage(url)
          : resolveAsset(url);
    });
  };
}

/**
 * Links to other posts are written as files, `../<id>/index.md`, so that
 * they work in Obsidian too; on the site they are the post's URL.
 */
const POST_LINK = /^\.\.\/([^/]+)\/index\.md(#.*)?$/;

function rehypePostLinks() {
  return (tree) => {
    visit(tree, 'element', (node) => {
      const match =
        node.tagName === 'a' && String(node.properties.href).match(POST_LINK);

      if (match) node.properties.href = `/${match[1]}${match[2] ?? ''}`;
    });
  };
}

/**
 * Posts are long and photo-heavy: only load the photos that scroll into view.
 */
function rehypeLazyImages() {
  return (tree) => {
    visit(tree, 'element', (node) => {
      if (node.tagName !== 'img') return;

      node.properties.loading = 'lazy';
      node.properties.decoding = 'async';
    });
  };
}

function remarkMatter() {
  return (_tree, file) => {
    matter(file);
  };
}

function base() {
  return unified()
    .use(remarkParse)
    .use(remarkFrontmatter)
    .use(remarkMatter)
    .use(remarkGfm)
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeRaw)
    .use(rehypePostLinks);
}

const metaProcessor = unified()
  .use(remarkParse)
  .use(remarkFrontmatter)
  .use(remarkGfm)
  .freeze();

/**
 * The HTML of a post or page, for the site.
 */
export async function renderPage(markdown, { resolveAsset, resolveImage }) {
  const file = await base()
    .use(rehypeSlug)
    .use(rehypeAssets, { resolveAsset, resolveImage })
    .use(rehypeLazyImages)
    .use(rehypeStringify)
    .process(markdown);

  return String(file);
}

/**
 * The HTML of a post, for the RSS feed. Feed readers do not run our CSS or JS.
 */
export async function renderFeed(markdown, { resolveAsset }) {
  const file = await base()
    .use(rehypeAssets, { resolveAsset })
    .use(rehypeStringify)
    .process(markdown);

  return String(file);
}

/**
 * The front matter, plus an excerpt made of the first paragraphs.
 *
 * Dates were written by hand in all sorts of formats
 * ("Sun Nov 15 2026 12:00:00 GMT+0100 (…)"), so they become ISO strings.
 */
export function readMeta(markdown) {
  const file = new VFile(markdown);

  matter(file);

  const data = { ...file.data.matter };
  const words = metaProcessor()
    .parse(file)
    .children.filter((node) => node.type === 'paragraph')
    .map((node) => toString(node))
    .join(' ')
    .split(/\s+/)
    .filter(Boolean);

  if (data.date) data.date = new Date(data.date).toISOString();

  return { ...data, excerpt: words.slice(0, EXCERPT_WORDS).join(' ') };
}
