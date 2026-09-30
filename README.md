# askiki's blog

Hi, I'm **askiki**, a student at Nanjing University. This is my personal blog: notes on
code, research, learning, and life at university or work. It's built with
[Astro](https://astro.build) and deployed to GitHub Pages.

**Read online:** https://askiki12.github.io/myblog/

---

## Using this blog as a template

If you'd like to use this framework for your own blog:

1. **Get the code** — fork or clone this repository.
2. **Install and run**:
   ```sh
   npm install
   npm run dev     # local preview
   npm run build   # production build into ./dist/
   ```
3. **Make it yours** — edit your name, school, links and site description in
   [`src/consts.ts`](./src/consts.ts).
4. **Deploy** — push to `main`; the GitHub Actions workflow builds and publishes to
   GitHub Pages. Enable **Settings → Pages → Source = GitHub Actions**. If you rename
   the repo, update `site` and `base` in [`astro.config.mjs`](./astro.config.mjs).

### Where to put posts and what format to use

**One post = one directory** under `src/content/blog/`:

```text
src/content/blog/my-post/
├── index.md          # the post body + fields (or index.mdx)
├── assets/           # images for this post, referenced relatively
└── childrenBlogs/    # optional nested posts
    └── child/
        └── index.md
```

A post is a Markdown (or MDX) file named `index.md`. The directory name becomes the URL
slug (`src/content/blog/my-post/index.md` → `/blog/my-post/`). Fields go in the
frontmatter:

```md
---
title: My post            # required
description: A one-line summary.   # required
pubDate: 2026-09-29       # required
heroImage: './assets/cover.jpg'    # optional
tags: ['astro', 'guide']  # optional
draft: false              # optional (true hides it)
---

Write the body in Markdown. Add images with `![alt](./assets/pic.png)`.
```

See [`AGENTS.md`](./AGENTS.md) for the full content conventions.
