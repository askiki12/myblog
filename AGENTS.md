## Development

Use the background dev server through `npx` (bare `astro` is **not** on the PATH):

```sh
npx astro dev --host 0.0.0.0 --port 8900   # start (background)
npx astro dev status                       # pid / uptime / url
npx astro dev logs
npx astro dev stop
```

This machine has no display, so remote preview requires `--host 0.0.0.0` and a port in
the firewall's allowed range (8090–9010); e.g. http://139.196.24.80:8900/myblog/.

Before finishing a change, verify the production build:

```sh
npm run build
```

Then verify UI changes with the headless browser (see "Browser tooling" below).

## Content conventions

Blog posts live in `src/content/blog/`. **One blog = one directory.**

```
src/content/blog/
└── my-post/                 # directory name = URL slug, NOT the title
    ├── index.md             # body + frontmatter (use index.md / index.mdx)
    ├── assets/              # images for this post, referenced relatively
    │   └── cover.jpg
    └── childrenBlogs/       # nested posts (optional; empty/missing = no children)
        └── child-post/
            ├── index.md
            └── assets/
```

Naming rules:

- The directory name is the URL slug/path segment and must be URL-friendly and unique among siblings. It does **not** have to match the display title (that comes from `title`).
- The Markdown file **must be `index.md` or `index.mdx`**. The loader strips the trailing `/index` (`generateId` in `src/content.config.ts`); any other filename becomes an extra URL/tree level.
- `assets` and `childrenBlogs` are reserved directory names.
- `childrenBlogs/<child>/index.md` becomes a child post. The `childrenBlogs` segment is removed from both the URL and the document tree.
- If a post directory also has `childrenBlogs`, the post node itself is clickable **and** expandable.

URL mapping:

| File | URL |
| --- | --- |
| `my-post/index.md` | `/blog/my-post/` |
| `my-post/childrenBlogs/child/index.md` | `/blog/my-post/child/` |

Frontmatter fields (`src/content.config.ts`):

| Field | Required | Notes |
| --- | --- | --- |
| `title` | yes | Post title |
| `description` | yes | Summary (cards, post header, RSS); build fails if missing |
| `pubDate` | yes | Sort/date; e.g. `2026-09-29` |
| `updatedDate` | no | Shows "Updated …" when set |
| `heroImage` | no | Relative path, e.g. `./assets/cover.jpg`; Astro optimizes it |
| `tags` | no | Array, defaults to `[]`; drives `/tags/*` pages |
| `draft` | no | Defaults to `false`; `true` hides it everywhere (no page built) |

Missing required fields are hard errors (Zod validation, build fails). Missing optional fields:
`updatedDate` → hidden; `tags` → no tags; `draft` → published.

Images and links:

- Put images in the post's `assets/` and reference them relatively: `![alt](./assets/x.png)`.
- `heroImage` uses a relative path too: `heroImage: './assets/cover.jpg'`.
- Free-form relative paths are allowed; `assets/` is the recommended convention.
- **Migration gotcha**: moving a Markdown/MDX file one level deeper breaks relative `import` paths — add one `../` per added level.

Cover behavior:

- **Home cards** (`src/components/PostCard.astro`): if `heroImage` is unset, `getCover()` in `src/covers.ts` picks a stable "random" fallback from `src/assets/covers/` (deterministic by post id).
- **Post pages** (`src/layouts/BlogPost.astro`): only show the hero when `heroImage` is explicitly set; otherwise no cover.

## Design & layout

- **Theme**: dark by default; light via `:root[data-theme='light']`. Tokens live in
  `src/styles/global.css`. Key sizes: `--content` (article reading width, `800px`),
  `--wide` (header/footer container, `1120px`).
  The toggle persists in `localStorage` (`theme`); an inline script in
  `BaseHead.astro` applies it before paint (no flash).
- **Article layout** (`src/layouts/BlogPost.astro`) is a 3-column grid:
  document tree | article | table of contents:
  `grid-template-columns: minmax(0, 1fr) minmax(0, var(--content)) minmax(0, 1fr)`.
  The center track is fixed and centered, so toggling a sidebar never moves or
  resizes the article.
  - **Do not remove `width: 100%` from `.post-shell`.** It is a flex child of
    `body`; with only `margin-inline: auto` it would shrink-to-fit and the side
    tracks would change with the tree/TOC content (subtle layout shift).
  - Sidebar visibility persists in `localStorage` (`sidebar-tree`, `sidebar-toc`).
  - Columns stack at `@media (max-width: 1280px)`; keep the JS
    `matchMedia('(min-width: 1281px)')` in sync.
- **Footer sticks to the bottom**: `body` is a flex column and `.post-shell` uses
  `flex: 1 0 auto`.
- **Post header order**: title → description → date/reading → tags.
- **Blog index** (`src/layouts/BlogIndex.astro`) has a client-side search box
  (right-aligned, same row as the title). It embeds `#post-search-index` (all posts)
  and filters in the browser; the heading switches from "All posts (N posts)" to
  "Search results (M posts)". Pagination is server-side (`POSTS_PER_PAGE` in
  `src/consts.ts`), page 1 at `/blog/`, then `/blog/page/N/`.

## Pitfalls (learned on this project)

- **Astro `base`**: internal links written as `<a href="/...">` do **not** get the
  base prefix automatically — use `withBase()` from `src/consts.ts`. Astro-generated
  asset URLs (fonts, `_astro/*`) do get it. This site is served under `/myblog/`.
- **Scoped styles don't reach JS-rendered or child-component DOM**: styles in a
  `.astro` component are scoped, so they won't apply to elements created by client
  JS, nor to a child component's root when you pass it a `class`. Put shared styles in
  `src/styles/global.css` for that reason (e.g. `.post-list`, `.tag-list` are global).
- **Hiding a grid item with `display:none` shifts the others**: later grid items
  auto-place into the vacated track. Assign explicit `grid-column` (or keep the track)
  instead — this caused the article to jump/narrow.
- **Flex item + `margin-inline:auto` shrinks to fit**: add `width:100%` when it should
  fill the container (see `.post-shell`).
- **Astro strips whitespace between elements**: a space between two inline elements can
  vanish; insert `{' '}` explicitly (e.g. between the title and the post count).
- **Moving a content file deeper breaks relative `import` paths** in MD/MDX — add one
  `../` per level.
- **Content ids come from `generateId`** (strips trailing `/index` and `childrenBlogs/`).
  Build URLs from `post.id`, don't hand-roll them.

## Browser tooling (visual / geometry checks)

**This machine has no display, so the headless browser is the only way to actually see
a rendered page.** Use it proactively for any style/layout/responsive change: take a
screenshot and/or measure element geometry, then report the result. Don't claim a UI
change works without checking here.

A Playwright Chromium is installed for development, outside this repo:

- Driver + helper scripts: `/root/browser-tools` (run scripts from there)
- Browser binaries: `~/.cache/ms-playwright` (persistent; system libs installed via apt)

```sh
cd /root/browser-tools
node shot.mjs <url> [out.png] [width] [height]   # screenshot + title/height/article rect
```

`shot.mjs` prints the page title, body height, and the `.post` rect. Write a small
ad-hoc script (using `playwright`) for anything else — e.g. click/type, read
`getBoundingClientRect()`, or screenshot at several breakpoints. Prefer a real screenshot
(`Read` the PNG) when judging visual changes.

## Verification checklist

- [ ] `npm run build` passes.
- [ ] For UI changes: screenshot/measure with the headless browser at ≥1 relevant
      viewport (and ideally a narrow one).
- [ ] Internal links use `withBase()`; generated URLs still point under `/myblog/`.

## Deployment

- Hosted on **GitHub Pages** at https://askiki12.github.io/myblog/.
- `astro.config.mjs` sets `site: 'https://askiki12.github.io'` and `base: '/myblog'`.
  If the repo is renamed, update `base`.
- Pushing to `main` runs `.github/workflows/deploy.yml`, which builds and publishes to
  Pages. The repo needs **Settings → Pages → Source = `GitHub Actions`** enabled, or the
  deploy step fails with `Failed to create deployment (status: 404)`.

## Documentation

Full documentation: https://docs.astro.build

Consult these guides before working on related tasks:

- [Adding pages, dynamic routes, or middleware](https://docs.astro.build/en/guides/routing/)
- [Working with Astro components](https://docs.astro.build/en/basics/astro-components/)
- [Using React, Vue, Svelte, or other framework components](https://docs.astro.build/en/guides/framework-components/)
- [Adding or managing content](https://docs.astro.build/en/guides/content-collections/)
- [Adding styles or using Tailwind](https://docs.astro.build/en/guides/styling/)
- [Supporting multiple languages](https://docs.astro.build/en/guides/internationalization/)
