export interface Bookmark {
	id: string;
	url: string;
	title: string;
	faviconUrl: string;
	order: number;
}

export type BookmarkSize = "small" | "medium" | "large";
