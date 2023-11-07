"use client";

import { Spinner } from "@nextui-org/react";

export default function Loading() {
	return (
		<div className="flex flex-grow flex-col items-center justify-center gap-2">
			<Spinner label="Đang tải..." color="primary" />
		</div>
	);
}
