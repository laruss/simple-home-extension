import elementReady, { type Options } from "element-ready";

export function $<T extends Element>(selector: string) {
	return document.querySelector<T>(selector);
}

export function $$<T extends Element>(selector: string) {
	return document.querySelectorAll<T>(selector);
}

export const waitFor = async (duration = 1000) =>
	new Promise((resolve) => setTimeout(resolve, duration));

export const waitForElement = async (selector: string, options?: Options) => {
	return elementReady(selector, {
		stopOnDomReady: false,
		...options,
	});
};

export const getCurrentTab = async () => {
	const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
	return tab;
};

/**
 * convenient method for chrome.storage
 */
export const storage = {
	set: async (key: string, value: unknown) => {
		return chrome.storage.sync
			.set({ [key]: value })
			.then(() => value)
			.catch(console.log);
	},
	get: async (key: string) => {
		return chrome.storage.sync
			.get(key)
			.then((result) => result[key])
			.catch(console.log);
	},
};

export const storageLocal = {
	set: async (key: string, value: unknown) => {
		return chrome.storage.local
			.set({ [key]: value })
			.then(() => value)
			.catch(console.log);
	},
	get: async (key: string) => {
		return chrome.storage.local
			.get(key)
			.then((result) => result[key])
			.catch(console.log);
	},
};

export interface SiteMetadata {
	title: string;
	faviconUrl: string;
}

export async function fetchSiteMetadata(url: string): Promise<SiteMetadata> {
	const response = await chrome.runtime.sendMessage({
		type: "FETCH_SITE_METADATA",
		url,
	});

	if (!response.success) {
		throw new Error(response.error || "Failed to fetch metadata");
	}

	return {
		title: response.title,
		faviconUrl: response.faviconUrl,
	};
}
