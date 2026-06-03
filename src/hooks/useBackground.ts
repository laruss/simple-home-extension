import { useCallback, useEffect, useState } from "react";
import { storageLocal } from "../utils";

const BACKGROUND_STORAGE_KEY = "backgroundImage";

export function useBackground() {
	const [backgroundUrl, setBackgroundUrl] = useState<string | null>(null);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		const loadBackground = async () => {
			try {
				const stored = await storageLocal.get(BACKGROUND_STORAGE_KEY);
				if (typeof stored === "string" && stored) {
					setBackgroundUrl(stored);
				}
			} catch (error) {
				console.error("Failed to load background:", error);
			} finally {
				setIsLoading(false);
			}
		};
		loadBackground();
	}, []);

	// Keep every hook instance (e.g. App.tsx and the modal) in sync.
	useEffect(() => {
		const handleChange = (
			changes: Record<string, chrome.storage.StorageChange>,
			areaName: string,
		) => {
			if (areaName !== "local" || !(BACKGROUND_STORAGE_KEY in changes)) {
				return;
			}
			const next = changes[BACKGROUND_STORAGE_KEY].newValue;
			setBackgroundUrl(typeof next === "string" && next ? next : null);
		};

		chrome.storage.onChanged.addListener(handleChange);
		return () => chrome.storage.onChanged.removeListener(handleChange);
	}, []);

	const setBackground = useCallback(async (dataUrl: string) => {
		setBackgroundUrl(dataUrl);
		try {
			await storageLocal.set(BACKGROUND_STORAGE_KEY, dataUrl);
		} catch (error) {
			console.error("Failed to save background:", error);
		}
	}, []);

	const resetBackground = useCallback(async () => {
		setBackgroundUrl(null);
		try {
			await storageLocal.remove(BACKGROUND_STORAGE_KEY);
		} catch (error) {
			console.error("Failed to reset background:", error);
		}
	}, []);

	return { backgroundUrl, isLoading, setBackground, resetBackground };
}
