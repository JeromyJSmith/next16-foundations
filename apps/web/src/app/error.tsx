"use client";

export default function ErrorPage({
	error,
	reset,
}: {
	error: Error & { digest?: string };
	reset: () => void;
}) {
	return (
		<main className="flex min-h-screen w-full items-center justify-center p-6">
			<div className="w-full max-w-md rounded-lg border border-red-200 bg-red-50 p-6">
				<h2 className="font-semibold text-lg text-red-800">
					Something went wrong
				</h2>
				<p className="mt-2 break-words text-red-700 text-sm">
					{error?.message || "An unexpected error occurred."}
				</p>
				<button
					type="button"
					onClick={() => reset()}
					className="mt-4 inline-flex items-center rounded-md bg-red-600 px-3 py-1.5 text-sm text-white hover:bg-red-700"
				>
					Try again
				</button>
			</div>
		</main>
	);
}
