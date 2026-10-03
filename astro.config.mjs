// @ts-check

import mdx from '@astrojs/mdx';
import { unified } from '@astrojs/markdown-remark';
import sitemap from '@astrojs/sitemap';
import { defineConfig, fontProviders } from 'astro/config';
import rehypeKatex from 'rehype-katex';
import remarkMath from 'remark-math';

// Render `$...$` (inline) and `$$...$$` (display) LaTeX with KaTeX.
// Astro 7 defaults to the Sätteri processor, which has no KaTeX renderer;
// switching to `unified()` keeps the remark/rehype pipeline so we can use
// remark-math + rehype-katex. MDX inherits `markdown.processor`, so `.mdx`
// gets math support too.
const processor = unified({
	remarkPlugins: [remarkMath],
	rehypePlugins: [rehypeKatex],
});

// https://astro.build/config
export default defineConfig({
	site: 'https://askiki12.github.io',
	base: '/myblog',
	markdown: { processor },
	integrations: [
		mdx(),
		// Exclude the legacy /tags/ redirect pages from the sitemap.
		sitemap({ filter: (page) => !page.includes('/tags/') }),
	],
	fonts: [
		{
			provider: fontProviders.local(),
			name: 'Atkinson',
			cssVariable: '--font-atkinson',
			fallbacks: ['sans-serif'],
			options: {
				variants: [
					{
						src: ['./src/assets/fonts/atkinson-regular.woff'],
						weight: 400,
						style: 'normal',
						display: 'swap',
					},
					{
						src: ['./src/assets/fonts/atkinson-bold.woff'],
						weight: 700,
						style: 'normal',
						display: 'swap',
					},
				],
			},
		},
	],
});
