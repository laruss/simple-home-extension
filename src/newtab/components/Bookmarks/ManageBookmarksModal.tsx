import { useState } from "react";
import type { Bookmark, BookmarkSize } from "../../../types/bookmark";
import {
	ArrowDownIcon,
	ArrowUpIcon,
	EditIcon,
	GripIcon,
	TrashIcon,
} from "../Icons";
import { Modal } from "../Modal";
import { EditBookmarkModal } from "./EditBookmarkModal";

interface ManageBookmarksModalProps {
	isOpen: boolean;
	onClose: () => void;
	bookmarks: Bookmark[];
	size: BookmarkSize;
	showAddButton: boolean;
	onRemove: (id: string) => Promise<void>;
	onReorder: (fromIndex: number, toIndex: number) => Promise<void>;
	onEdit: (
		id: string,
		url: string,
		title: string,
		faviconUrl: string,
	) => Promise<void>;
	onSizeChange: (size: BookmarkSize) => Promise<void>;
	onShowAddButtonChange: (show: boolean) => Promise<void>;
	onChangeBackground: () => void;
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
	showAddButton,
	onRemove,
	onReorder,
	onEdit,
	onSizeChange,
	onShowAddButtonChange,
	onChangeBackground,
}: ManageBookmarksModalProps) {
	const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
	const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
	const [editingBookmark, setEditingBookmark] = useState<Bookmark | null>(null);

	const handleMoveUp = (index: number) => {
		if (index > 0) {
			onReorder(index, index - 1);
		}
	};

	const handleMoveDown = (index: number) => {
		if (index < bookmarks.length - 1) {
			void onReorder(index, index + 1);
		}
	};

	const handleDragStart = (e: React.DragEvent, index: number) => {
		setDraggedIndex(index);
		e.dataTransfer.effectAllowed = "move";
		e.dataTransfer.setData("text/plain", String(index));
	};

	const handleDragOver = (e: React.DragEvent, index: number) => {
		e.preventDefault();
		e.dataTransfer.dropEffect = "move";
		if (draggedIndex !== null && index !== draggedIndex) {
			setDragOverIndex(index);
		}
	};

	const handleDragLeave = () => {
		setDragOverIndex(null);
	};

	const handleDrop = (e: React.DragEvent, toIndex: number) => {
		e.preventDefault();
		if (draggedIndex !== null && draggedIndex !== toIndex) {
			void onReorder(draggedIndex, toIndex);
		}
		setDraggedIndex(null);
		setDragOverIndex(null);
	};

	const handleDragEnd = () => {
		setDraggedIndex(null);
		setDragOverIndex(null);
	};

	return (
		<>
			<Modal isOpen={isOpen} onClose={onClose} title="Settings">
				<div className="mb-4">
					<span className="mb-2 block text-sm font-medium text-gray-700">
						Background
					</span>
					<button
						type="button"
						onClick={onChangeBackground}
						className="rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-200"
					>
						Change Background
					</button>
				</div>

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

				<div className="mb-6 border-t border-gray-100 pt-4">
					<label className="flex cursor-pointer items-center justify-between">
						<span className="text-sm font-medium text-gray-700">
							Show Add Button
						</span>
						<input
							type="checkbox"
							checked={showAddButton}
							onChange={(e) => onShowAddButtonChange(e.target.checked)}
							className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
						/>
					</label>
				</div>

				<div className="max-h-64 space-y-2 overflow-y-auto">
					{bookmarks.length === 0 ? (
						<p className="py-4 text-center text-gray-500">No bookmarks yet</p>
					) : (
						bookmarks.map((bookmark, index) => (
							<div
								key={bookmark.id}
								draggable
								onDragStart={(e) => handleDragStart(e, index)}
								onDragOver={(e) => handleDragOver(e, index)}
								onDragLeave={handleDragLeave}
								onDrop={(e) => handleDrop(e, index)}
								onDragEnd={handleDragEnd}
								className={`flex items-center gap-2 rounded-lg bg-gray-50 p-3 transition-all ${
									draggedIndex === index ? "opacity-50" : ""
								} ${
									dragOverIndex === index
										? "border-t-2 border-blue-400"
										: "border-t-2 border-transparent"
								}`}
							>
								<span className="cursor-grab text-gray-400 active:cursor-grabbing">
									<GripIcon size={16} />
								</span>
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
										onClick={() => setEditingBookmark(bookmark)}
										className="rounded p-1.5 text-gray-500 transition-colors hover:bg-gray-200 hover:text-gray-700"
										aria-label={`Edit ${bookmark.title}`}
									>
										<EditIcon size={16} />
									</button>
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

			<EditBookmarkModal
				isOpen={editingBookmark !== null}
				onClose={() => setEditingBookmark(null)}
				bookmark={editingBookmark}
				onApply={onEdit}
			/>
		</>
	);
}
