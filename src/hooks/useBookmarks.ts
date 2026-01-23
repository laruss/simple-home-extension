import { useCallback, useEffect, useState } from "react";
import type { Bookmark, BookmarkSize } from "../types/bookmark";
import { storage } from "../utils";

const STORAGE_KEY = "bookmarks";
const SIZE_STORAGE_KEY = "bookmarkSize";

export function useBookmarks() {
	const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
	const [size, setSize] = useState<BookmarkSize>("small");
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		const loadData = async () => {
			try {
				const [storedBookmarks, storedSize] = await Promise.all([
					storage.get(STORAGE_KEY),
					storage.get(SIZE_STORAGE_KEY),
				]);
				if (storedBookmarks && Array.isArray(storedBookmarks)) {
					setBookmarks(storedBookmarks.sort((a, b) => a.order - b.order));
				}
				if (storedSize) {
					setSize(storedSize as BookmarkSize);
				}
			} catch (error) {
				console.error("Failed to load bookmarks:", error);
			} finally {
				setIsLoading(false);
			}
		};
		loadData();
	}, []);

	const saveBookmarks = useCallback(async (newBookmarks: Bookmark[]) => {
		try {
			await storage.set(STORAGE_KEY, newBookmarks);
		} catch (error) {
			console.error("Failed to save bookmarks:", error);
		}
	}, []);

	const addBookmark = useCallback(
		async (url: string, title: string, faviconUrl: string) => {
			const newBookmark: Bookmark = {
				id: crypto.randomUUID(),
				url,
				title,
				faviconUrl,
				order: bookmarks.length,
			};
			const newBookmarks = [...bookmarks, newBookmark];
			setBookmarks(newBookmarks);
			await saveBookmarks(newBookmarks);
		},
		[bookmarks, saveBookmarks],
	);

	const removeBookmark = useCallback(
		async (id: string) => {
			const newBookmarks = bookmarks
				.filter((b) => b.id !== id)
				.map((b, index) => ({ ...b, order: index }));
			setBookmarks(newBookmarks);
			await saveBookmarks(newBookmarks);
		},
		[bookmarks, saveBookmarks],
	);

	const reorderBookmarks = useCallback(
		async (fromIndex: number, toIndex: number) => {
			if (
				fromIndex < 0 ||
				toIndex < 0 ||
				fromIndex >= bookmarks.length ||
				toIndex >= bookmarks.length
			) {
				return;
			}

			const newBookmarks = [...bookmarks];
			const [removed] = newBookmarks.splice(fromIndex, 1);
			newBookmarks.splice(toIndex, 0, removed);
			const reordered = newBookmarks.map((b, index) => ({
				...b,
				order: index,
			}));
			setBookmarks(reordered);
			await saveBookmarks(reordered);
		},
		[bookmarks, saveBookmarks],
	);

	const setBookmarkSize = useCallback(async (newSize: BookmarkSize) => {
		setSize(newSize);
		try {
			await storage.set(SIZE_STORAGE_KEY, newSize);
		} catch (error) {
			console.error("Failed to save bookmark size:", error);
		}
	}, []);

	return {
		bookmarks,
		size,
		isLoading,
		addBookmark,
		removeBookmark,
		reorderBookmarks,
		setBookmarkSize,
	};
}
