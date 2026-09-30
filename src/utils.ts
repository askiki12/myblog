import type { CollectionEntry } from 'astro:content';

export interface ReadingStats {
	words: number;
	minutes: number;
}

const CJK = /[\u3040-\u30ff\u3400-\u4dbf\u4e00-\u9fff\uf900-\ufaff\uac00-\ud7af]/g;

/**
 * Estimate word count and reading time from raw markdown.
 * Counts CJK characters individually and Latin words by whitespace.
 */
export function getReadingStats(body?: string): ReadingStats {
	let text = body ?? '';
	text = text
		.replace(/```[\s\S]*?```/g, ' ')
		.replace(/`[^`]*`/g, ' ')
		.replace(/!\[[^\]]*\]\([^)]*\)/g, ' ')
		.replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
		.replace(/<[^>]+>/g, ' ')
		.replace(/[#>*_~`|-]/g, ' ');

	const cjkCount = (text.match(CJK) || []).length;
	const latinText = text.replace(CJK, ' ');
	const latinCount = (latinText.match(/[A-Za-z0-9]+(?:['’-][A-Za-z0-9]+)*/g) || []).length;

	const words = cjkCount + latinCount;
	const minutes = Math.max(1, Math.round(latinCount / 200 + cjkCount / 300));

	return { words, minutes };
}

/** Strip markdown/HTML down to plain text, for search indexing. */
export function getPlainText(body?: string): string {
	return (body ?? '')
		.replace(/```[\s\S]*?```/g, ' ')
		.replace(/`[^`]*`/g, ' ')
		.replace(/!\[[^\]]*\]\([^)]*\)/g, ' ')
		.replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
		.replace(/<[^>]+>/g, ' ')
		.replace(/[#>*_~|]/g, ' ')
		.replace(/\s+/g, ' ')
		.trim();
}

/** Turn a human tag (e.g. "Web Dev") into a URL-safe slug ("web-dev"). */
export function tagSlug(tag: string): string {
	return tag
		.trim()
		.toLowerCase()
		.replace(/[^\p{L}\p{N}]+/gu, '-')
		.replace(/^-+|-+$/g, '');
}

export interface TreeNode {
	name: string;
	path: string;
	title: string;
	post?: CollectionEntry<'blog'>;
	children: TreeNode[];
	/** Number of posts in this subtree (including the node's own post, if any). */
	count: number;
}

/**
 * Build a nested tree from post ids. Sub-directories become intermediate
 * nodes; the root node represents the home page.
 */
export function buildPostTree(posts: CollectionEntry<'blog'>[]): TreeNode {
	const root: TreeNode = { name: '', path: '', title: 'Home', children: [], count: 0 };

	for (const post of posts) {
		const parts = post.id.split('/');
		let node = root;
		let acc = '';

		parts.forEach((part, index) => {
			acc = acc ? `${acc}/${part}` : part;
			let child = node.children.find((entry) => entry.name === part);
			if (!child) {
				child = { name: part, path: acc, title: part.replace(/[-_]/g, ' '), children: [], count: 0 };
				node.children.push(child);
			}
			if (index === parts.length - 1) {
				child.post = post;
				child.title = post.data.title;
			}
			node = child;
		});
	}

	const finalize = (node: TreeNode): number => {
		node.children.sort((a, b) => a.title.localeCompare(b.title));
		node.count = (node.post ? 1 : 0) + node.children.reduce((sum, child) => sum + finalize(child), 0);
		return node.count;
	};
	finalize(root);

	return root;
}
