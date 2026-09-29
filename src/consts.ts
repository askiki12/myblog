// Place any global data in this file.
// You can import this data from anywhere in your site by using the `import` keyword.

export const AUTHOR = 'askiki';
export const SCHOOL = 'Nanjing University';
export const AVATAR = '/avatar.svg';
export const GITHUB = 'https://github.com/askiki12';

export const SITE_TITLE = AUTHOR;
export const SITE_DESCRIPTION =
	'Personal blog of askiki — notes on code, research, learning, and life at university or work.';

export const BASE_URL = import.meta.env.BASE_URL;

export function withBase(path = ''): string {
	const base = BASE_URL.endsWith('/') ? BASE_URL : `${BASE_URL}/`;
	return base + path.replace(/^\//, '');
}
