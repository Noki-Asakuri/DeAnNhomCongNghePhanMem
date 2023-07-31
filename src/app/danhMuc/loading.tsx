export default function LoadingLayout() {
	return (
		<div className="flex flex-1 flex-col items-center justify-center">
			<div
				className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
				role="status"
			></div>

			<p className="mt-2 text-sm text-gray-700">Loading...</p>
		</div>
	);
}