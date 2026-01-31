// uncomment if you want options.html to be opened after extension is installed
/*
chrome.runtime.onInstalled.addListener(async ({ reason }) => {
  if (reason === chrome.runtime.OnInstalledReason.INSTALL) {
    chrome.tabs.create({
      url: 'options.html',
    });
  }
});
*/

interface SiteMetadataResponse {
	success: boolean;
	title?: string;
	faviconUrl?: string;
	error?: string;
}

const GOOGLE_FAVICON_SIZES = [256, 128, 64];

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
	if (message.type === "FETCH_SITE_METADATA") {
		fetchSiteMetadata(message.url)
			.then(sendResponse)
			.catch((error) =>
				sendResponse({
					success: false,
					error: error instanceof Error ? error.message : "Unknown error",
				}),
			);
		return true; // Keep message channel open for async response
	}
});

function getGoogleFaviconUrl(hostname: string, size: number) {
	return `https://www.google.com/s2/favicons?domain=${hostname}&sz=${size}`;
}

function arrayBufferToBase64(buffer: ArrayBuffer): string {
	let binary = "";
	const bytes = new Uint8Array(buffer);
	const chunkSize = 0x8000;
	for (let i = 0; i < bytes.length; i += chunkSize) {
		binary += String.fromCharCode(...bytes.subarray(i, i + chunkSize));
	}
	return btoa(binary);
}

async function fetchImageAsDataUrl(url: string): Promise<string | null> {
	try {
		const response = await fetch(url);
		if (!response.ok) {
			return null;
		}
		const contentType = response.headers.get("content-type") || "image/png";
		if (!contentType.startsWith("image/")) {
			return null;
		}
		const buffer = await response.arrayBuffer();
		if (buffer.byteLength === 0) {
			return null;
		}
		const base64 = arrayBufferToBase64(buffer);
		return `data:${contentType};base64,${base64}`;
	} catch {
		return null;
	}
}

function parseIconSize(raw: string | null): number {
	if (!raw) {
		return 0;
	}
	const normalized = raw.toLowerCase();
	if (normalized.includes("any")) {
		return 512;
	}
	const sizes = normalized.split(/\s+/);
	let maxSize = 0;
	for (const size of sizes) {
		const [w, h] = size.split("x").map((value) => Number(value));
		if (Number.isFinite(w) && Number.isFinite(h)) {
			maxSize = Math.max(maxSize, w, h);
		}
	}
	return maxSize;
}

function extractIconLinks(html: string, baseUrl: string): string[] {
	const linkTags = html.match(/<link\s+[^>]*>/gi) ?? [];
	const candidates: { url: string; size: number }[] = [];

	for (const tag of linkTags) {
		const relMatch = tag.match(/rel\s*=\s*["']([^"']+)["']/i);
		if (!relMatch) {
			continue;
		}
		const rel = relMatch[1].toLowerCase();
		if (!rel.includes("icon")) {
			continue;
		}

		const hrefMatch = tag.match(/href\s*=\s*["']([^"']+)["']/i);
		if (!hrefMatch) {
			continue;
		}
		const sizesMatch = tag.match(/sizes\s*=\s*["']([^"']+)["']/i);
		const size = parseIconSize(sizesMatch?.[1] ?? null);
		try {
			const resolvedUrl = new URL(hrefMatch[1], baseUrl).toString();
			candidates.push({ url: resolvedUrl, size });
		} catch {}
	}

	return candidates
		.sort((a, b) => b.size - a.size)
		.map((candidate) => candidate.url);
}

async function resolveFaviconDataUrl(
	parsedUrl: URL,
	html?: string,
): Promise<string | null> {
	if (html) {
		const iconLinks = extractIconLinks(html, parsedUrl.toString());
		for (const iconUrl of iconLinks) {
			const dataUrl = await fetchImageAsDataUrl(iconUrl);
			if (dataUrl) {
				return dataUrl;
			}
		}
	}

	for (const size of GOOGLE_FAVICON_SIZES) {
		const fallbackUrl = getGoogleFaviconUrl(parsedUrl.hostname, size);
		const dataUrl = await fetchImageAsDataUrl(fallbackUrl);
		if (dataUrl) {
			return dataUrl;
		}
	}

	return null;
}

async function fetchSiteMetadata(url: string): Promise<SiteMetadataResponse> {
	let parsedUrl: URL;
	try {
		parsedUrl = new URL(url);
	} catch {
		return {
			success: false,
			error: "Invalid URL",
		};
	}
	try {
		const response = await fetch(url, {
			headers: {
				"User-Agent":
					"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
			},
		});

		if (!response.ok) {
			const fallbackFavicon = await resolveFaviconDataUrl(parsedUrl);
			return {
				success: true,
				title: parsedUrl.hostname,
				faviconUrl: fallbackFavicon ?? "",
			};
		}

		const html = await response.text();
		const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
		const title = titleMatch ? titleMatch[1].trim() : parsedUrl.hostname;
		const faviconUrl = await resolveFaviconDataUrl(parsedUrl, html);

		return {
			success: true,
			title,
			faviconUrl: faviconUrl ?? "",
		};
	} catch {
		const fallbackFavicon = await resolveFaviconDataUrl(parsedUrl);
		return {
			success: true,
			title: parsedUrl.hostname,
			faviconUrl: fallbackFavicon ?? "",
		};
	}
}
