import type { Bookmark, BookmarkSize } from "../../../types/bookmark";
import { ArrowDownIcon, ArrowUpIcon, TrashIcon } from "../Icons";
import { Modal } from "../Modal";

interface ManageBookmarksModalProps {
	isOpen: boolean;
	onClose: () => void;
	bookmarks: Bookmark[];
	size: BookmarkSize;
	onRemove: (id: string) => Promise<void>;
	onReorder: (fromIndex: number, toIndex: number) => Promise<void>;
	onSizeChange: (size: BookmarkSize) => Promise<void>;
}

const sizes: { value: BookmarkSize; label: string }[] = [
	{ value: "small", label: "Small" },
	{ value: "medium", label: "Medium" },
	{ value: "large", label: "Large" },
];

export function ManageBookmarksModal({
	isOpen,
	onClose,
	bookmarks,
	size,
	onRemove,
	onReorder,
	onSizeChange,
}: ManageBookmarksModalProps) {
	const handleMoveUp = (index: number) => {
		if (index > 0) {
			onReorder(index, index - 1);
		}
	};

	const handleMoveDown = (index: number) => {
		if (index < bookmarks.length - 1) {
			onReorder(index, index + 1);
		}
	};

	return (
		<Modal isOpen={isOpen} onClose={onClose} title="Manage Bookmarks">
			<div className="mb-4">
				<span className="mb-2 block text-sm font-medium text-gray-700">
					Icon Size
				</span>
				<div className="flex gap-2">
					{sizes.map((s) => (
						<button
							key={s.value}
							type="button"
							onClick={() => onSizeChange(s.value)}
							className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
								size === s.value
									? "bg-blue-600 text-white"
									: "bg-gray-100 text-gray-700 hover:bg-gray-200"
							}`}
						>
							{s.label}
						</button>
					))}
				</div>
			</div>

			<div className="max-h-64 space-y-2 overflow-y-auto">
				{bookmarks.length === 0 ? (
					<p className="py-4 text-center text-gray-500">No bookmarks yet</p>
				) : (
					bookmarks.map((bookmark, index) => (
						<div
							key={bookmark.id}
							className="flex items-center gap-3 rounded-lg bg-gray-50 p-3"
						>
							<img
								src={bookmark.faviconUrl}
								alt=""
								className="h-6 w-6 rounded"
								onError={(e) => {
									(e.target as HTMLImageElement).style.display = "none";
								}}
							/>
							<span
								className="flex-1 truncate text-sm text-gray-700"
								title={bookmark.title}
							>
								{bookmark.title}
							</span>
							<div className="flex items-center gap-1">
								<button
									type="button"
									onClick={() => handleMoveUp(index)}
									disabled={index === 0}
									className="rounded p-1.5 text-gray-500 transition-colors hover:bg-gray-200 hover:text-gray-700 disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-transparent"
									aria-label={`Move ${bookmark.title} up`}
								>
									<ArrowUpIcon size={16} />
								</button>
								<button
									type="button"
									onClick={() => handleMoveDown(index)}
									disabled={index === bookmarks.length - 1}
									className="rounded p-1.5 text-gray-500 transition-colors hover:bg-gray-200 hover:text-gray-700 disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-transparent"
									aria-label={`Move ${bookmark.title} down`}
								>
									<ArrowDownIcon size={16} />
								</button>
								<button
									type="button"
									onClick={() => onRemove(bookmark.id)}
									className="rounded p-1.5 text-gray-500 transition-colors hover:bg-red-100 hover:text-red-600"
									aria-label={`Delete ${bookmark.title}`}
								>
									<TrashIcon size={16} />
								</button>
							</div>
						</div>
					))
				)}
			</div>

			<div className="mt-4 flex justify-end">
				<button
					type="button"
					onClick={onClose}
					className="rounded-lg bg-gray-100 px-4 py-2 font-medium text-gray-700 transition-colors hover:bg-gray-200"
				>
					Done
				</button>
			</div>
		</Modal>
	);
}
