import { useRef, useState } from "react";
import { useBackground } from "../../hooks/useBackground";
import { UploadIcon } from "./Icons";
import { Modal } from "./Modal";

interface ChangeBackgroundModalProps {
	isOpen: boolean;
	onClose: () => void;
}

const MAX_FILE_SIZE = 5 * 1024 * 1024;

export function ChangeBackgroundModal({
	isOpen,
	onClose,
}: ChangeBackgroundModalProps) {
	const { backgroundUrl, setBackground, resetBackground } = useBackground();
	const [isDragging, setIsDragging] = useState(false);
	const [error, setError] = useState("");
	const fileInputRef = useRef<HTMLInputElement>(null);

	const handleFile = (file?: File) => {
		if (!file) {
			return;
		}
		if (!file.type.startsWith("image/")) {
			setError("Please select an image file");
			return;
		}
		if (file.size > MAX_FILE_SIZE) {
			setError("Image must be 5 MB or smaller");
			return;
		}
		const reader = new FileReader();
		reader.onload = () => {
			const result = typeof reader.result === "string" ? reader.result : "";
			if (result) {
				setBackground(result);
				setError("");
			}
		};
		reader.onerror = () => {
			setError("Failed to read the image file");
		};
		reader.readAsDataURL(file);
	};

	const handleDrop = (e: React.DragEvent) => {
		e.preventDefault();
		setIsDragging(false);
		handleFile(e.dataTransfer.files?.[0]);
	};

	const handleReset = () => {
		resetBackground();
		setError("");
	};

	return (
		<Modal isOpen={isOpen} onClose={onClose} title="Change Background">
			<div className="space-y-4">
				<button
					type="button"
					onClick={() => fileInputRef.current?.click()}
					onDragOver={(e) => {
						e.preventDefault();
						setIsDragging(true);
					}}
					onDragLeave={() => setIsDragging(false)}
					onDrop={handleDrop}
					className={`flex w-full flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed px-6 py-10 text-center transition-colors ${
						isDragging
							? "border-blue-500 bg-blue-50"
							: "border-gray-300 bg-gray-50 hover:bg-gray-100"
					}`}
				>
					<UploadIcon className="text-gray-400" size={32} />
					<div className="text-sm text-gray-600">
						<span className="font-medium text-blue-600">Click to upload</span>{" "}
						or drag and drop
					</div>
					<p className="text-xs text-gray-500">
						Use a horizontal (landscape) image, max 5 MB.
					</p>
				</button>

				<input
					ref={fileInputRef}
					type="file"
					accept="image/*"
					onChange={(e) => {
						handleFile(e.target.files?.[0]);
						if (e.target) {
							e.target.value = "";
						}
					}}
					className="hidden"
				/>

				{error && <p className="text-sm text-red-600">{error}</p>}

				{backgroundUrl && (
					<div className="space-y-2">
						<span className="block text-sm font-medium text-gray-700">
							Current background
						</span>
						<img
							src={backgroundUrl}
							alt="Current background preview"
							className="h-32 w-full rounded-lg object-cover"
						/>
					</div>
				)}

				<div className="flex justify-between gap-2 pt-2">
					<button
						type="button"
						onClick={handleReset}
						disabled={!backgroundUrl}
						className="rounded-lg px-4 py-2 font-medium text-gray-600 transition-colors hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
					>
						Reset to default
					</button>
					<button
						type="button"
						onClick={onClose}
						className="rounded-lg bg-gray-100 px-4 py-2 font-medium text-gray-700 transition-colors hover:bg-gray-200"
					>
						Done
					</button>
				</div>
			</div>
		</Modal>
	);
}
