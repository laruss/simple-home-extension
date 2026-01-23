import { useState } from "react";
import { useBookmarks } from "../../../hooks/useBookmarks";
import type { BookmarkSize } from "../../../types/bookmark";
import { GearIcon, PlusIcon } from "../Icons";
import { AddBookmarkModal } from "./AddBookmarkModal";
import { BookmarkItem } from "./BookmarkItem";
import { ManageBookmarksModal } from "./ManageBookmarksModal";

const addButtonSizeClasses: Record<
	BookmarkSize,
	{ button: string; icon: number }
> = {
	small: { button: "h-14 w-14 rounded-xl", icon: 20 },
	medium: { button: "h-20 w-20 rounded-2xl", icon: 24 },
	large: { button: "h-28 w-28 rounded-2xl", icon: 32 },
};

export function BookmarksContainer() {
	const {
		bookmarks,
		size,
		isLoading,
		addBookmark,
		removeBookmark,
		reorderBookmarks,
		setBookmarkSize,
	} = useBookmarks();
	const [isAddModalOpen, setIsAddModalOpen] = useState(false);
	const [isManageModalOpen, setIsManageModalOpen] = useState(false);

	if (isLoading) {
		return null;
	}

	const isEmpty = bookmarks.length === 0;
	const addBtnClasses = addButtonSizeClasses[size];

	return (
		<div className="group relative mx-auto mt-8 w-full px-4 lg:max-w-[66%]">
			{!isEmpty && (
				<button
					type="button"
					onClick={() => setIsManageModalOpen(true)}
					className="absolute -top-1 right-4 rounded-lg p-2 text-white/70 opacity-0 transition-all hover:bg-white/20 hover:text-white group-hover:opacity-100"
					aria-label="Manage bookmarks"
				>
					<GearIcon size={18} />
				</button>
			)}

			<div className="max-h-52 overflow-visible pt-8 pb-2">
				{isEmpty ? (
					<div className="flex justify-center">
						<button
							type="button"
							onClick={() => setIsAddModalOpen(true)}
							className={`flex items-center justify-center bg-white/90 shadow-md backdrop-blur-sm transition-all hover:scale-105 hover:bg-white hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-white/50 ${addBtnClasses.button}`}
							aria-label="Add first bookmark"
						>
							<PlusIcon className="text-gray-500" size={addBtnClasses.icon} />
						</button>
					</div>
				) : (
					<div className="flex flex-wrap justify-center gap-3 px-1">
						{bookmarks.map((bookmark) => (
							<BookmarkItem key={bookmark.id} bookmark={bookmark} size={size} />
						))}
						<button
							type="button"
							onClick={() => setIsAddModalOpen(true)}
							className={`flex items-center justify-center bg-white/70 shadow-md backdrop-blur-sm transition-all hover:scale-105 hover:bg-white/90 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-white/50 ${addBtnClasses.button}`}
							aria-label="Add bookmark"
						>
							<PlusIcon className="text-gray-400" size={addBtnClasses.icon} />
						</button>
					</div>
				)}
			</div>

			<AddBookmarkModal
				isOpen={isAddModalOpen}
				onClose={() => setIsAddModalOpen(false)}
				onAdd={addBookmark}
			/>

			<ManageBookmarksModal
				isOpen={isManageModalOpen}
				onClose={() => setIsManageModalOpen(false)}
				bookmarks={bookmarks}
				size={size}
				onRemove={removeBookmark}
				onReorder={reorderBookmarks}
				onSizeChange={setBookmarkSize}
			/>
		</div>
	);
}
