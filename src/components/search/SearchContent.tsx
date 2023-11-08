"use client";

import { cn } from "@/utils/common";
import { dayjs } from "@/utils/dayjs";
import { encodeBanTinPath } from "@/utils/path";
import { api } from "@/utils/trpc/react";
import type { RouterOutputs } from "@/utils/trpc/shared";

import { ChiaSeDropdown } from "../chiaSeDropdown";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { Button, Divider, Image, Input, Pagination, Select, SelectItem, Spinner, Tooltip, User } from "@nextui-org/react";

import { Eye, MessagesSquare, SearchX } from "lucide-react";
import { type ChangeEvent, Fragment, useCallback, useState } from "react";
import toast from "react-hot-toast";
import type { ClassNameValue } from "tailwind-merge";

const perPage = [6, 12, 18, 25, 50] as const;

export const SearchContent = ({
	initialNews,
	host,
	className,
	authors,
	categories,
}: {
	className?: ClassNameValue;
	initialNews: RouterOutputs["banTin"]["searchBanTin"];
	host: string;
	categories: RouterOutputs["common"]["getCategories"];
	authors: RouterOutputs["common"]["getAuthors"];
}) => {
	const pathname = usePathname();
	const searchParams = new URLSearchParams(useSearchParams());
	const router = useRouter();

	const [searchQuery, setSearchQuery] = useState<{
		value: string;
		category: string;
		author: string;
	}>({
		value: searchParams.get("query") ?? "",
		author: "",
		category: "",
	});

	const [page, setPage] = useState(Number(searchParams.get("page") ?? "1"));
	const [rowsPerPage, setRowPerPage] = useState<(typeof perPage)[number]>(6);

	const { data: searchData, isRefetching } = api.banTin.searchBanTin.useQuery(
		{
			pageNum: page,
			perPage: rowsPerPage,
			query: searchQuery,
		},
		{
			placeholderData: initialNews,
			keepPreviousData: true,
			refetchOnMount: false,
			refetchOnWindowFocus: false,
			onError: ({ message }) => toast.error("Lỗi: " + message),
			onSuccess: () => {
				const totalPages = Math.ceil(searchData!.count / rowsPerPage);
				if (page > totalPages) setPage(totalPages);
			},
		},
	);

	const pages = Math.ceil(searchData!.count / rowsPerPage);

	const updatePage = useCallback((page: number, updateUrl = true) => {
		setPage(page);

		searchParams.set("page", (page + 1).toString());
		if (updateUrl) router.replace(pathname + "?" + searchParams.toString(), { scroll: false });
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const onNextPage = useCallback(() => {
		if (page < pages) {
			updatePage(page + 1);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [page, pages]);

	const onPreviousPage = useCallback(() => {
		if (page > 1) {
			updatePage(page - 1);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [page]);

	const onPageChange = useCallback(
		(page: number) => {
			updatePage(page);
		},
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[page],
	);

	const onRowsPerPageChange = useCallback((e: ChangeEvent<HTMLSelectElement>) => {
		setRowPerPage(Number(e.target.value.slice("per-page-".length)) as typeof rowsPerPage);
		updatePage(1);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const onValueChange = useCallback(
		({ value, author, category }: { value?: string; author?: string; category?: string }) => {
			updatePage(1, false);

			if (typeof value !== "undefined") {
				setSearchQuery((prev) => ({ ...prev, value }));

				if (value.length) searchParams.set("query", value);
				else searchParams.delete("query");
			}

			if (typeof author !== "undefined") {
				setSearchQuery((prev) => ({ ...prev, author }));

				if (author.length) searchParams.set("author", author);
				else searchParams.delete("author");
			}

			if (typeof category !== "undefined") {
				setSearchQuery((prev) => ({ ...prev, category }));

				if (category.length) searchParams.set("category", category);
				else searchParams.delete("category");
			}

			router.replace(pathname + "?" + searchParams.toString(), { scroll: false });
		},
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[],
	);

	return (
		<article className={cn("flex flex-grow flex-col gap-4", className)}>
			<section className="flex flex-shrink-0 flex-col gap-4">
				<h3 className="text-lg font-semibold">Kết quả tìm kiếm ({searchData!.count}) </h3>

				<Input
					isClearable
					label="Tìm kiếm"
					labelPlacement="outside"
					value={searchQuery.value}
					placeholder="Nhập từ khóa bạn muốn tìm kiếm..."
					onValueChange={(value) => onValueChange({ value })}
				/>

				<div className="flex items-center gap-4">
					<Select
						labelPlacement="outside"
						placeholder="Phân loại theo danh mục"
						items={categories}
						label="Danh mục"
						className="max-w-xs"
						onChange={(e) => onValueChange({ category: e.target.value })}
					>
						{(item) => <SelectItem key={item.MaDanhMuc}>{item.TenDanhMuc}</SelectItem>}
					</Select>

					<Select
						labelPlacement="outside"
						placeholder="Phân loại theo tác giả"
						items={authors}
						label="Tác giả"
						className="max-w-xs"
						onChange={(e) => onValueChange({ author: e.target.value })}
					>
						{(item) => (
							<SelectItem key={item.MaTaiKhoan} textValue={item.TenTaiKhoan!}>
								<User name={item.TenTaiKhoan} avatarProps={{ size: "sm", src: item.AnhDaiDien, showFallback: true }} />
							</SelectItem>
						)}
					</Select>

					<Select
						labelPlacement="outside"
						label="Cột từng trang"
						placeholder="Chọn số lượng hiển thị"
						items={perPage.map((num) => ({ key: "per-page-" + num, value: String(num) }))}
						onChange={onRowsPerPageChange}
						defaultSelectedKeys={["per-page-" + rowsPerPage]}
						className="w-[180px]"
					>
						{(item) => <SelectItem key={item.key}>{item.value}</SelectItem>}
					</Select>
				</div>
			</section>

			<Divider />

			<section
				className={cn("flex flex-grow flex-col gap-4", {
					"items-center justify-center": isRefetching || (!isRefetching && searchData!.data.length === 0),
				})}
			>
				{isRefetching && <Spinner color="primary" label="Đang tải..." />}

				{!isRefetching && searchData!.data.length === 0 && (
					<div className="flex flex-col items-center gap-4">
						<SearchX size={48} />
						<p>Không tìm thấy bản tin nào</p>
					</div>
				)}

				{!isRefetching &&
					searchData!.data.map((banTin, index, array) => {
						const banTinPath = encodeBanTinPath(banTin);

						return (
							<Fragment key={banTin.MaBanTin}>
								<div className="flex flex-col gap-4">
									<Link className="flex gap-4" href={banTinPath}>
										<Image
											src={banTin.PreviewImage}
											alt={banTin.NoiDungTomTat}
											width="160"
											height="90"
											classNames={{
												wrapper: "block aspect-video h-auto w-40 flex-shrink-0",
												img: "w-full h-full object-center object-cover",
											}}
										/>
										<div className="flex flex-grow flex-col">
											<h3 className="h-10 font-semibold">{banTin.TenBanTin}</h3>
											<p className="line-clamp-2">{banTin.NoiDungTomTat}</p>
										</div>
									</Link>

									<section className="flex gap-4">
										<span className="w-40">
											<User
												name={banTin.NhanVien.TaiKhoan.TenTaiKhoan}
												avatarProps={{ size: "sm", src: banTin.NhanVien.TaiKhoan.AnhDaiDien, showFallback: true }}
											/>
										</span>

										<div className="flex flex-grow items-center justify-between">
											<div className="flex items-center justify-center gap-2">
												<span className="font-semibold text-danger">{banTin.DanhMuc.TenDanhMuc}</span>
												<span> - </span>
												<Tooltip content={dayjs(banTin.NgayDang).format("DD/MM/YYYY - HH:mm")}>
													<span>{dayjs(banTin.NgayDang).fromNow()}</span>
												</Tooltip>
												<span> - </span>
												<span className="flex items-center gap-2">
													<MessagesSquare size={20} /> {banTin._count.DanhGia}
												</span>
												<span> - </span>
												<span className="flex items-center gap-2">
													<Eye size={20} /> {banTin.LuoiXem}
												</span>
											</div>

											<ChiaSeDropdown
												duongDanBanTin={banTinPath}
												host={host}
												tenBanTin={banTin.TenBanTin}
												maBanTin={banTin.MaBanTin}
											/>
										</div>
									</section>
								</div>

								{index < array.length - 1 && <Divider />}
							</Fragment>
						);
					})}
			</section>

			<Divider />

			<section className="flex flex-shrink-0 items-center justify-between px-2 py-2">
				<Button isDisabled={pages === 1 || isRefetching} color="primary" onPress={onPreviousPage}>
					Previous
				</Button>

				{pages > 0 && (
					<Pagination isDisabled={isRefetching} showShadow color="primary" page={page} total={pages} onChange={onPageChange} />
				)}

				<Button isDisabled={pages === 1 || isRefetching} color="primary" onPress={onNextPage}>
					Next
				</Button>
			</section>
		</article>
	);
};
