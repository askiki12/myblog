## Development

When starting the dev server, use background mode:

```
astro dev --background
```

Manage the background server with `astro dev stop`, `astro dev status`, and `astro dev logs`.

Before finishing a change, verify the production build:

```
npm run build
```

For remote preview (this machine has no UI), bind the dev server to an allowed port:

```
npx astro dev --host 0.0.0.0 --port 8900
```

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

## Browser tooling (visual / geometry checks)

A Playwright Chromium is installed for development, outside this repo:

- Driver + helper script: `/root/browser-tools` (run scripts from there)
- Browser binaries: `~/.cache/ms-playwright`

```sh
cd /root/browser-tools
node shot.mjs <url> [out.png] [width] [height]
```

Use it to screenshot pages or measure layout (`getBoundingClientRect`) when changing
styles or responsive behavior.

## Documentation

Full documentation: https://docs.astro.build

Consult these guides before working on related tasks:

- [Adding pages, dynamic routes, or middleware](https://docs.astro.build/en/guides/routing/)
- [Working with Astro components](https://docs.astro.build/en/basics/astro-components/)
- [Using React, Vue, Svelte, or other framework components](https://docs.astro.build/en/guides/framework-components/)
- [Adding or managing content](https://docs.astro.build/en/guides/content-collections/)
- [Adding styles or using Tailwind](https://docs.astro.build/en/guides/styling/)
- [Supporting multiple languages](https://docs.astro.build/en/guides/internationalization/)
