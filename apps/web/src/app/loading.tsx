import { nanoid } from "nanoid";

export default function Loading() {
	return (
		<main className="flex min-h-screen w-full animate-pulse flex-col">
			<header className="border-gray-200 border-b bg-white/80 px-6 py-4 backdrop-blur-sm">
				<div className="mx-auto max-w-7xl">
					<div className="h-7 w-48 rounded bg-gray-200" />
					<div className="mt-2 h-4 w-64 rounded bg-gray-100" />
				</div>
			</header>
			<div className="mx-auto w-full max-w-7xl flex-1 space-y-6 p-6">
				<div className="h-6 w-40 rounded bg-gray-200" />
				<div className="h-64 rounded border border-gray-200 bg-gray-100" />
				<div className="h-6 w-56 rounded bg-gray-200" />
				<div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
					{Array.from({ length: 3 }).map(() => (
						<div
							key={nanoid()}
							className="rounded-lg border border-gray-200 bg-gray-50 p-4"
						>
							<div className="mb-2 h-4 w-3/5 rounded bg-gray-200" />
							<div className="mb-3 h-3 w-2/5 rounded bg-gray-100" />
							<div className="h-32 rounded border border-gray-200 bg-gray-100" />
						</div>
					))}
				</div>
			</div>
			<footer className="border-gray-200 border-t bg-white/80 px-6 py-4 backdrop-blur-sm" />
		</main>
	);
}
