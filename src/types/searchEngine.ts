export interface SearchEngine {
	id: string;
	name: string;
	domain: string;
	searchUrl: string;
}

export const SEARCH_ENGINES: SearchEngine[] = [
	{
		id: "google",
		name: "Google",
		domain: "google.com",
		searchUrl: "https://www.google.com/search?q=",
	},
	{
		id: "bing",
		name: "Bing",
		domain: "bing.com",
		searchUrl: "https://www.bing.com/search?q=",
	},
	{
		id: "perplexity",
		name: "Perplexity",
		domain: "perplexity.ai",
		searchUrl: "https://www.perplexity.ai/search?q=",
	},
	{
		id: "yandex",
		name: "Yandex",
		domain: "yandex.com",
		searchUrl: "https://yandex.com/search/?text=",
	},
	{
		id: "baidu",
		name: "Baidu",
		domain: "baidu.com",
		searchUrl: "https://www.baidu.com/s?wd=",
	},
];

export function getFaviconUrl(domain: string): string {
	return `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;
}
