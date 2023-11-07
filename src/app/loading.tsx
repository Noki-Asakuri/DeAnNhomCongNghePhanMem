"use client";

import { Spinner } from "@nextui-org/react";

export default function LoadingLayout() {
	return (
		<div className="flex flex-1 items-center justify-center">
			<Spinner label="Đang tải..." color="primary" />
		</div>
	);
}
