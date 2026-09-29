import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const blog = defineCollection({
	// One blog = one directory: `index.md` (+ `assets/`, `childrenBlogs/`).
	loader: glob({
		base: './src/content/blog',
		pattern: '**/*.{md,mdx}',
		// Turn `my-post/index.md` and `my-post/childrenBlogs/child/index.md`
		// into ids `my-post` and `my-post/child`.
		generateId: ({ entry }) =>
			entry
				.replace(/\.(md|mdx)$/i, '')
				.replace(/\/index$/i, '')
				.split('/')
				.filter((segment) => segment !== 'childrenBlogs')
				.join('/'),
	}),
	// Type-check frontmatter using a schema
	schema: ({ image }) =>
		z.object({
			title: z.string(),
			description: z.string(),
			// Transform string to Date object
			pubDate: z.coerce.date(),
			updatedDate: z.coerce.date().optional(),
			heroImage: z.optional(image()),
			tags: z.array(z.string()).default([]),
			draft: z.boolean().default(false),
		}),
});

export const collections = { blog };
