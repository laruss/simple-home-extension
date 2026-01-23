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

async function fetchSiteMetadata(url: string): Promise<SiteMetadataResponse> {
	try {
		const parsedUrl = new URL(url);
		const faviconUrl = `https://www.google.com/s2/favicons?domain=${parsedUrl.hostname}&sz=64`;

		const response = await fetch(url, {
			headers: {
				"User-Agent":
					"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
			},
		});

		if (!response.ok) {
			return {
				success: true,
				title: parsedUrl.hostname,
				faviconUrl,
			};
		}

		const html = await response.text();
		const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
		const title = titleMatch ? titleMatch[1].trim() : parsedUrl.hostname;

		return {
			success: true,
			title,
			faviconUrl,
		};
	} catch {
		const parsedUrl = new URL(url);
		return {
			success: true,
			title: parsedUrl.hostname,
			faviconUrl: `https://www.google.com/s2/favicons?domain=${parsedUrl.hostname}&sz=64`,
		};
	}
}
