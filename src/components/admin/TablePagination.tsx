"use client";

import { Button, Pagination } from "@nextui-org/react";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useCallback } from "react";

type Props = {
	page: number;
	data: { count: number };
	rowsPerPage: number;
	isRefetching: boolean;
	setPage: (page: number) => void;
};

export const TablePagination = ({ page, data, rowsPerPage, isRefetching, setPage }: Props) => {
	const pages = Math.ceil(data.count / rowsPerPage);

	const onNextPage = useCallback(() => {
		if (page < pages) setPage(page + 1);
		else setPage(1);
	}, [page, pages]);

	const onPreviousPage = useCallback(() => {
		if (page > 1) setPage(page - 1);
		else setPage(pages);
	}, [page]);

	if (pages <= 1) return;

	return (
		<section className="flex items-center gap-2">
			<Button isIconOnly isDisabled={pages <= 1 || isRefetching} variant="flat" onPress={onPreviousPage}>
				<ChevronLeft />
			</Button>

			<Pagination
				size="lg"
				isCompact
				showShadow
				page={page}
				total={pages}
				color="primary"
				onChange={setPage}
				isDisabled={isRefetching}
			/>

			<Button isIconOnly isDisabled={pages <= 1 || isRefetching} variant="flat" onPress={onNextPage}>
				<ChevronRight />
			</Button>
		</section>
	);
};
