import { useEffect, useRef } from "react";
import {
	type SearchEngine,
	SEARCH_ENGINES,
	getFaviconUrl,
} from "../../types/searchEngine";

interface SearchEngineDropdownProps {
	selectedEngine: SearchEngine;
	onSelect: (engine: SearchEngine) => void;
	isOpen: boolean;
	onToggle: () => void;
}

function ChevronDownIcon({ className }: { className?: string }) {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width="12"
			height="12"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round"
			className={className}
			role="img"
			aria-label="Expand"
		>
			<path d="m6 9 6 6 6-6" />
		</svg>
	);
}

export function SearchEngineDropdown({
	selectedEngine,
	onSelect,
	isOpen,
	onToggle,
}: SearchEngineDropdownProps) {
	const dropdownRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		function handleClickOutside(event: MouseEvent) {
			if (
				dropdownRef.current &&
				!dropdownRef.current.contains(event.target as Node)
			) {
				if (isOpen) {
					onToggle();
				}
			}
		}

		document.addEventListener("mousedown", handleClickOutside);
		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, [isOpen, onToggle]);

	return (
		<div ref={dropdownRef} className="absolute left-2 top-1/2 z-10 -translate-y-1/2">
			<button
				type="button"
				onClick={onToggle}
				className="flex items-center gap-1 rounded-full p-1.5 transition-colors hover:bg-gray-100"
				aria-label={`Search engine: ${selectedEngine.name}`}
				aria-expanded={isOpen}
				aria-haspopup="listbox"
			>
				<img
					src={getFaviconUrl(selectedEngine.domain)}
					alt={selectedEngine.name}
					width={24}
					height={24}
					className="rounded"
				/>
				<ChevronDownIcon
					className={`text-gray-500 transition-transform ${isOpen ? "rotate-180" : ""}`}
				/>
			</button>

			{isOpen && (
				<div
					className="absolute left-0 top-full z-50 mt-1 min-w-[160px] overflow-hidden rounded-lg bg-white shadow-lg"
					role="listbox"
					aria-label="Search engines"
				>
					{SEARCH_ENGINES.map((engine) => (
						<button
							key={engine.id}
							type="button"
							onClick={() => {
								onSelect(engine);
								onToggle();
							}}
							className={`flex w-full items-center gap-3 px-3 py-2 text-left transition-colors hover:bg-gray-100 ${
								engine.id === selectedEngine.id ? "bg-gray-50" : ""
							}`}
							role="option"
							aria-selected={engine.id === selectedEngine.id}
						>
							<img
								src={getFaviconUrl(engine.domain)}
								alt=""
								width={20}
								height={20}
								className="rounded"
							/>
							<span className="text-sm text-gray-700">{engine.name}</span>
						</button>
					))}
				</div>
			)}
		</div>
	);
}
