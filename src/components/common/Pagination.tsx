"use client";

import { Pagination as NextPagination } from "@nextui-org/react";
import { useRouter } from "next/navigation";

export const Pagination = ({ page, total, url }: { page: number; total: number; url: string }) => {
	const router = useRouter();

	return (
		<NextPagination
			total={total}
			page={page}
			onChange={(newPage) => {
				const searchParams = new URLSearchParams();
				searchParams.set("page", newPage.toString());
				router.push(url + "?" + searchParams.toString());
			}}
		/>
	);
};
