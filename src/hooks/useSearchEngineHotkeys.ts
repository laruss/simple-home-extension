import { useEffect } from "react";
import { SEARCH_ENGINES, type SearchEngine } from "../types/searchEngine";

interface UseSearchEngineHotkeysOptions {
	onSelect: (engine: SearchEngine) => void;
	onCloseDropdown?: () => void;
}

export function useSearchEngineHotkeys({
	onSelect,
	onCloseDropdown,
}: UseSearchEngineHotkeysOptions) {
	useEffect(() => {
		const isMac = /Mac|iPhone|iPad|iPod/.test(navigator.platform);
		const engineKeyMap: Record<string, string> = {
			KeyG: "google",
			KeyB: "bing",
			KeyP: "perplexity",
			KeyY: "yandex",
			KeyX: "baidu",
		};

		const handleGlobalKeyDown = (event: KeyboardEvent) => {
			const isModifierCombo = isMac
				? event.metaKey && event.altKey
				: event.ctrlKey && event.altKey;

			if (!isModifierCombo) {
				return;
			}

			const engineId = engineKeyMap[event.code];
			if (!engineId) {
				return;
			}

			event.preventDefault();
			const engine = SEARCH_ENGINES.find((item) => item.id === engineId);
			if (engine) {
				onCloseDropdown?.();
				onSelect(engine);
			}
		};

		window.addEventListener("keydown", handleGlobalKeyDown);
		return () => {
			window.removeEventListener("keydown", handleGlobalKeyDown);
		};
	}, [onCloseDropdown, onSelect]);
}
