"use client";

import { Spinner } from "@nextui-org/react";

export default function LoadingLayout() {
	return (
		<div className="flex flex-1 items-center justify-center">
			<Spinner label="Loading..." color="primary" />
		</div>
	);
}
