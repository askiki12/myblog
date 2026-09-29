// Place any global data in this file.
// You can import this data from anywhere in your site by using the `import` keyword.

export const SITE_TITLE = 'Astro Blog';
export const SITE_DESCRIPTION = 'Welcome to my website!';

export const BASE_URL = import.meta.env.BASE_URL;

export function withBase(path = ''): string {
	const base = BASE_URL.endsWith('/') ? BASE_URL : `${BASE_URL}/`;
	return base + path.replace(/^\//, '');
}
