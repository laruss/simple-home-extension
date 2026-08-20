import { useEffect, useRef, useState } from "react";
import type { Bookmark } from "../../../types/bookmark";
import { fetchSiteMetadata } from "../../../utils";
import { LoaderIcon, UploadIcon } from "../Icons";
import { Modal } from "../Modal";

interface EditBookmarkModalProps {
	isOpen: boolean;
	onClose: () => void;
	bookmark: Bookmark | null;
	onApply: (
		id: string,
		url: string,
		title: string,
		faviconUrl: string,
	) => Promise<void>;
}

export function EditBookmarkModal({
	isOpen,
	onClose,
	bookmark,
	onApply,
}: EditBookmarkModalProps) {
	const [url, setUrl] = useState("");
	const [title, setTitle] = useState("");
	const [faviconUrl, setFaviconUrl] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState("");
	const fileInputRef = useRef<HTMLInputElement>(null);

	useEffect(() => {
		if (isOpen && bookmark) {
			setUrl(bookmark.url);
			setTitle(bookmark.title);
			setFaviconUrl(bookmark.faviconUrl);
			setError("");
			setIsLoading(false);
		}
	}, [isOpen, bookmark]);

	const normalizeUrl = (input: string): string => {
		let normalized = input.trim();
		if (!/^https?:\/\//i.test(normalized)) {
			normalized = `https://${normalized}`;
		}
		return normalized;
	};

	const isValidUrl = (input: string): boolean => {
		try {
			new URL(normalizeUrl(input));
			return true;
		} catch {
			return false;
		}
	};

	const handleFetch = async () => {
		if (!url.trim()) {
			setError("Please enter a URL");
			return;
		}

		if (!isValidUrl(url)) {
			setError("Please enter a valid URL");
			return;
		}

		setError("");
		setIsLoading(true);

		try {
			const normalizedUrl = normalizeUrl(url);
			const metadata = await fetchSiteMetadata(normalizedUrl);
			setUrl(normalizedUrl);
			setTitle(metadata.title);
			setFaviconUrl(metadata.faviconUrl);
		} catch {
			setError(
				"Failed to fetch site info. You can still edit the bookmark manually.",
			);
			const normalizedUrl = normalizeUrl(url);
			setUrl(normalizedUrl);
		} finally {
			setIsLoading(false);
		}
	};

	const handleUrlBlur = () => {
		if (
			url.trim() &&
			isValidUrl(url) &&
			!isLoading &&
			bookmark &&
			normalizeUrl(url) !== bookmark.url
		) {
			handleFetch();
		}
	};

	const handleApply = async () => {
		if (!bookmark) return;

		if (!url.trim()) {
			setError("Please enter a URL");
			return;
		}

		if (!isValidUrl(url)) {
			setError("Please enter a valid URL");
			return;
		}

		if (!title.trim()) {
			setError("Please enter a title");
			return;
		}

		await onApply(bookmark.id, normalizeUrl(url), title.trim(), faviconUrl);
		onClose();
	};

	const handleIconUpload = (file?: File) => {
		if (!file) return;
		if (!file.type.startsWith("image/")) {
			setError("Please select an image file");
			return;
		}
		const reader = new FileReader();
		reader.onload = () => {
			const result = typeof reader.result === "string" ? reader.result : "";
			setFaviconUrl(result);
			setError("");
		};
		reader.onerror = () => {
			setError("Failed to read the icon file");
		};
		reader.readAsDataURL(file);
	};

	const handleKeyDown = (e: React.KeyboardEvent) => {
		if (e.key === "Enter" && !isLoading) {
			e.preventDefault();
			handleApply();
		}
	};

	return (
		<Modal isOpen={isOpen} onClose={onClose} title="Edit Bookmark">
			<div className="space-y-4">
				<div>
					<label
						htmlFor="edit-bookmark-url"
						className="mb-1 block text-sm font-medium text-gray-700"
					>
						URL
					</label>
					<div className="flex gap-2">
						<input
							id="edit-bookmark-url"
							type="text"
							value={url}
							onChange={(e) => {
								setUrl(e.target.value);
								setError("");
							}}
							onBlur={handleUrlBlur}
							onKeyDown={handleKeyDown}
							placeholder="https://example.com"
							className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-gray-800 placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
							disabled={isLoading}
						/>
						<button
							type="button"
							onClick={handleFetch}
							disabled={isLoading || !url.trim()}
							className="rounded-lg bg-gray-100 px-4 py-2 font-medium text-gray-700 transition-colors hover:bg-gray-200 disabled:cursor-not-allowed disabled:opacity-50"
						>
							{isLoading ? <LoaderIcon size={20} /> : "Fetch"}
						</button>
					</div>
				</div>

				<div className="flex items-center gap-3 rounded-lg bg-gray-50 p-3">
					{faviconUrl ? (
						<img
							src={faviconUrl}
							alt=""
							className="h-8 w-8 rounded"
							onError={(e) => {
								(e.target as HTMLImageElement).style.display = "none";
							}}
						/>
					) : (
						<span className="text-xs text-gray-500">No favicon</span>
					)}
					<span className="text-sm text-gray-600">Favicon preview</span>
					<div className="ml-auto">
						<input
							ref={fileInputRef}
							type="file"
							accept="image/*"
							onChange={(e) => {
								handleIconUpload(e.target.files?.[0]);
								if (e.target) {
									e.target.value = "";
								}
							}}
							className="hidden"
						/>
						<button
							type="button"
							onClick={() => fileInputRef.current?.click()}
							className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 transition-colors hover:bg-gray-100"
						>
							<UploadIcon className="text-gray-500" />
							<span>Custom icon</span>
						</button>
					</div>
				</div>

				<div>
					<label
						htmlFor="edit-bookmark-title"
						className="mb-1 block text-sm font-medium text-gray-700"
					>
						Title
					</label>
					<input
						id="edit-bookmark-title"
						type="text"
						value={title}
						onChange={(e) => setTitle(e.target.value)}
						onKeyDown={handleKeyDown}
						placeholder="Bookmark title"
						className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-800 placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
					/>
				</div>

				{error && <p className="text-sm text-red-600">{error}</p>}

				<div className="flex justify-end gap-2 pt-2">
					<button
						type="button"
						onClick={onClose}
						className="rounded-lg px-4 py-2 font-medium text-gray-600 transition-colors hover:bg-gray-100"
					>
						Cancel
					</button>
					<button
						type="button"
						onClick={handleApply}
						disabled={isLoading || !url.trim()}
						className="rounded-lg bg-blue-600 px-4 py-2 font-medium text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
					>
						Apply
					</button>
				</div>
			</div>
		</Modal>
	);
}
