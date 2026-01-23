import {type KeyboardEvent, useEffect, useRef, useState} from "react";
import {SEARCH_ENGINES, type SearchEngine} from "../types/searchEngine";
import {storage} from "../utils";
import {BookmarksContainer} from "./components/Bookmarks/BookmarksContainer";
import {SearchEngineDropdown} from "./components/SearchEngineDropdown";

function SearchIcon() {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width="20"
			height="20"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round"
			role="img"
			aria-label="Search"
		>
			<circle cx="11" cy="11" r="8" />
			<path d="m21 21-4.3-4.3" />
		</svg>
	);
}

export function App() {
	const [query, setQuery] = useState("");
	const ref = useRef<HTMLInputElement>(null);
	const [selectedEngine, setSelectedEngine] = useState<SearchEngine>(
		SEARCH_ENGINES[0],
	);
	const [isDropdownOpen, setIsDropdownOpen] = useState(false);

	useEffect(() => {
		if (location.search !== '?' && !location.href.includes('?')) {
			location.search = '?';
		}

		setTimeout(() => ref.current?.focus(), 0);
	}, []);

	useEffect(() => {
		storage.get("searchEngine").then((savedEngineId) => {
			if (savedEngineId) {
				const engine = SEARCH_ENGINES.find((e) => e.id === savedEngineId);
				if (engine) {
					setSelectedEngine(engine);
				}
			}
		});
	}, []);

	const handleEngineSelect = (engine: SearchEngine) => {
		setSelectedEngine(engine);
		storage.set("searchEngine", engine.id);
	};

	const handleSearch = () => {
		if (query.trim()) {
			window.location.href = `${selectedEngine.searchUrl}${encodeURIComponent(query.trim())}`;
		}
	};

	const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
		if (e.key === "Enter") {
			handleSearch();
		}
	};

	return (
		<div
			className="min-h-screen w-full bg-cover bg-fixed bg-center bg-no-repeat"
			style={{ backgroundImage: "url('../background.webp')" }}
		>
			<div className="pt-32">
				<div className="mx-auto w-full max-w-xl px-4">
					<div className="relative">
						<SearchEngineDropdown
							selectedEngine={selectedEngine}
							onSelect={handleEngineSelect}
							isOpen={isDropdownOpen}
							onToggle={() => setIsDropdownOpen(!isDropdownOpen)}
						/>
						<input
							ref={ref}
							type="text"
							value={query}
							onChange={(e) => setQuery(e.target.value)}
							onKeyDown={handleKeyDown}
							placeholder={`Search ${selectedEngine.name}`}
							className="w-full rounded-full bg-white/90 py-3 pl-14 pr-12 text-base text-gray-800 shadow-lg backdrop-blur-sm placeholder:text-gray-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-white/50"
							// biome-ignore lint/a11y/noAutofocus: Autofocus is expected UX for new tab search
							autoFocus
						/>
						<button
							type="button"
							onClick={handleSearch}
							className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full p-2 text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-800"
							aria-label="Search"
						>
							<SearchIcon />
						</button>
					</div>
				</div>

				<BookmarksContainer />
			</div>
		</div>
	);
}
