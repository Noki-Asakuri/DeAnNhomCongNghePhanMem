"use client";

import { Card, Spinner } from "@nextui-org/react";

export default function LoadingLayout() {
	return (
		<Card className="flex h-full w-full items-start justify-center">
			<div className="flex h-full w-full flex-1 items-center justify-center">
				<Spinner label="Loading..." color="primary" />
			</div>
		</Card>
	);
}
