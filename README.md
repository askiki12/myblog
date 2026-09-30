# askiki's blog

A personal blog built with [Astro](https://astro.build), deployed to GitHub Pages
at **https://askiki12.github.io/myblog/**.

## Features

- Markdown / MDX posts with typed frontmatter (Zod) and draft support
- Dark theme by default, light theme toggle (persisted, no flash)
- Home page with profile, latest posts and topics
- Blog index with search and pagination
- Browse page: a tags wall and a full-page document tree
- Per-post table of contents and a document tree for navigating between posts
- RSS and sitemap
- Reading time and word count
- Home cards get a deterministic fallback cover; post pages show a cover only when set

## Commands

All commands run from the project root:

| Command             | Action                                       |
| :------------------ | :------------------------------------------- |
| `npm install`       | Install dependencies                         |
| `npm run dev`       | Start the dev server                         |
| `npm run build`     | Build the production site to `./dist/`       |
| `npm run preview`   | Preview the production build locally         |
| `npm run astro ...` | Run Astro CLI commands (e.g. `astro check`)  |

## Project structure

```text
src/
├── assets/              # shared images + cover fallbacks (covers/)
├── components/          # Header, Footer, PostCard, DocumentTree, TableOfContents, ...
├── content/
│   └── blog/            # posts (one directory per post)
├── layouts/
│   └── BlogPost.astro   # article layout (tree | article | TOC)
├── pages/               # routes: /, /blog, /browse, /about, /rss.xml
├── styles/global.css    # theme tokens + base styles
├── consts.ts            # site title, author, links
├── covers.ts            # heroImage fallback picker
├── utils.ts             # reading stats, tag slug, post tree
└── content.config.ts    # content collection + schema + generateId
```

## Writing a post

Posts live in `src/content/blog/`, **one directory per post**:

```text
src/content/blog/my-post/
├── index.md          # body + frontmatter (or index.mdx)
├── assets/           # images for this post (referenced relatively)
└── childrenBlogs/    # optional nested posts
    └── child/
        └── index.md
```

```md
---
title: My post
description: A one-line summary.
pubDate: 2026-09-29
heroImage: './assets/cover.jpg'   # optional
tags: ['astro', 'guide']          # optional
---

Body written in Markdown. Images: `![alt](./assets/pic.png)`.
```

`title`, `description` and `pubDate` are required; the build fails if they are missing.
See [`AGENTS.md`](./AGENTS.md) for the full conventions (URL mapping, `childrenBlogs`,
cover behavior, layout tokens).

## Deployment

Pushing to `main` triggers the GitHub Actions workflow in
`.github/workflows/deploy.yml`, which builds the site and publishes it to GitHub Pages.
The repo must have **Settings → Pages → Source = GitHub Actions** enabled.

## Credits

Initial scaffolding from the [Astro blog template](https://github.com/withastro/astro),
originally based on [Bear Blog](https://github.com/HermanMartinus/bearblog/).
