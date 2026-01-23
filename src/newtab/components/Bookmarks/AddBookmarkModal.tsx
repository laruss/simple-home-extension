import { useState } from "react";
import { fetchSiteMetadata } from "../../../utils";
import { LoaderIcon } from "../Icons";
import { Modal } from "../Modal";

interface AddBookmarkModalProps {
	isOpen: boolean;
	onClose: () => void;
	onAdd: (url: string, title: string, faviconUrl: string) => Promise<void>;
}

export function AddBookmarkModal({
	isOpen,
	onClose,
	onAdd,
}: AddBookmarkModalProps) {
	const [url, setUrl] = useState("");
	const [title, setTitle] = useState("");
	const [faviconUrl, setFaviconUrl] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const [isFetched, setIsFetched] = useState(false);
	const [error, setError] = useState("");

	const resetForm = () => {
		setUrl("");
		setTitle("");
		setFaviconUrl("");
		setIsFetched(false);
		setError("");
		setIsLoading(false);
	};

	const handleClose = () => {
		resetForm();
		onClose();
	};

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
			setIsFetched(true);
		} catch {
			setError(
				"Failed to fetch site info. You can still add the bookmark manually.",
			);
			const normalizedUrl = normalizeUrl(url);
			setUrl(normalizedUrl);
			const hostname = new URL(normalizedUrl).hostname;
			setTitle(hostname);
			setFaviconUrl(
				`https://www.google.com/s2/favicons?domain=${hostname}&sz=64`,
			);
			setIsFetched(true);
		} finally {
			setIsLoading(false);
		}
	};

	const handleUrlBlur = () => {
		if (url.trim() && isValidUrl(url) && !isFetched && !isLoading) {
			handleFetch();
		}
	};

	const handleAdd = async () => {
		if (!isFetched) {
			await handleFetch();
			return;
		}

		if (!title.trim()) {
			setError("Please enter a title");
			return;
		}

		await onAdd(url, title.trim(), faviconUrl);
		handleClose();
	};

	const handleKeyDown = (e: React.KeyboardEvent) => {
		if (e.key === "Enter" && !isLoading) {
			e.preventDefault();
			handleAdd();
		}
	};

	return (
		<Modal isOpen={isOpen} onClose={handleClose} title="Add Bookmark">
			<div className="space-y-4">
				<div>
					<label
						htmlFor="bookmark-url"
						className="mb-1 block text-sm font-medium text-gray-700"
					>
						URL
					</label>
					<div className="flex gap-2">
						<input
							id="bookmark-url"
							type="text"
							value={url}
							onChange={(e) => {
								setUrl(e.target.value);
								setIsFetched(false);
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

				{isFetched && (
					<>
						<div className="flex items-center gap-3 rounded-lg bg-gray-50 p-3">
							<img
								src={faviconUrl}
								alt=""
								className="h-8 w-8 rounded"
								onError={(e) => {
									(e.target as HTMLImageElement).style.display = "none";
								}}
							/>
							<span className="text-sm text-gray-600">Favicon preview</span>
						</div>

						<div>
							<label
								htmlFor="bookmark-title"
								className="mb-1 block text-sm font-medium text-gray-700"
							>
								Title
							</label>
							<input
								id="bookmark-title"
								type="text"
								value={title}
								onChange={(e) => setTitle(e.target.value)}
								onKeyDown={handleKeyDown}
								placeholder="Bookmark title"
								className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-800 placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
							/>
						</div>
					</>
				)}

				{error && <p className="text-sm text-red-600">{error}</p>}

				<div className="flex justify-end gap-2 pt-2">
					<button
						type="button"
						onClick={handleClose}
						className="rounded-lg px-4 py-2 font-medium text-gray-600 transition-colors hover:bg-gray-100"
					>
						Cancel
					</button>
					<button
						type="button"
						onClick={handleAdd}
						disabled={isLoading || !url.trim()}
						className="rounded-lg bg-blue-600 px-4 py-2 font-medium text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
					>
						{isFetched ? "Add" : "Fetch & Add"}
					</button>
				</div>
			</div>
		</Modal>
	);
}
