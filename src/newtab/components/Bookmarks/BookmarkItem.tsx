import { useState } from "react";
import type { Bookmark, BookmarkSize } from "../../../types/bookmark";

interface BookmarkItemProps {
	bookmark: Bookmark;
	size: BookmarkSize;
}

const sizeClasses: Record<
	BookmarkSize,
	{ button: string; icon: string; fallback: string }
> = {
	small: {
		button: "h-14 w-14 rounded-xl",
		icon: "h-8 w-8",
		fallback: "text-xl",
	},
	medium: {
		button: "h-20 w-20 rounded-2xl",
		icon: "h-12 w-12",
		fallback: "text-3xl",
	},
	large: {
		button: "h-28 w-28 rounded-2xl",
		icon: "h-16 w-16",
		fallback: "text-4xl",
	},
};

export function BookmarkItem({ bookmark, size }: BookmarkItemProps) {
	const [imgError, setImgError] = useState(false);
	const classes = sizeClasses[size];

	const handleClick = () => {
		window.location.href = bookmark.url;
	};

	const handleKeyDown = (e: React.KeyboardEvent) => {
		if (e.key === "Enter" || e.key === " ") {
			e.preventDefault();
			handleClick();
		}
	};

	return (
		<div className="group/item relative">
			<button
				type="button"
				onClick={handleClick}
				onKeyDown={handleKeyDown}
				className={`flex items-center justify-center bg-white/90 shadow-md backdrop-blur-sm transition-all hover:scale-105 hover:bg-white hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-white/50 ${classes.button}`}
				aria-label={`Open ${bookmark.title}`}
			>
				{!imgError ? (
					<img
						src={bookmark.faviconUrl}
						alt=""
						className={`rounded ${classes.icon}`}
						onError={() => setImgError(true)}
					/>
				) : (
					<span className={`font-semibold text-gray-600 ${classes.fallback}`}>
						{bookmark.title.charAt(0).toUpperCase()}
					</span>
				)}
			</button>
			<div className="pointer-events-none absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap rounded bg-gray-900 px-2 py-1 text-xs text-white opacity-0 transition-opacity group-hover/item:opacity-100">
				{bookmark.title}
			</div>
		</div>
	);
}
