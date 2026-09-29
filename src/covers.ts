import type { ImageMetadata } from 'astro';
import type { CollectionEntry } from 'astro:content';
import cover1 from './assets/covers/cover-1.jpg';
import cover2 from './assets/covers/cover-2.jpg';
import cover3 from './assets/covers/cover-3.jpg';
import cover4 from './assets/covers/cover-4.jpg';

const fallbackCovers: ImageMetadata[] = [cover1, cover2, cover3, cover4];

/**
 * Deterministically pick a fallback cover from the post id, so a post without
 * its own `heroImage` always gets the "same random" cover on every build.
 */
export function fallbackCover(id: string): ImageMetadata {
	let hash = 0;
	for (let i = 0; i < id.length; i++) {
		hash = (hash * 31 + id.charCodeAt(i)) >>> 0;
	}
	return fallbackCovers[hash % fallbackCovers.length];
}

export function getCover(post: CollectionEntry<'blog'>): ImageMetadata {
	return post.data.heroImage ?? fallbackCover(post.id);
}
