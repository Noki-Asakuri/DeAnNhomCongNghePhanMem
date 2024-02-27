"use client";

import { ObjectKeys, cn } from "@/utils/common";
import { dayjs } from "@/utils/dayjs";
import { encodeBanTinPath } from "@/utils/path";
import { api } from "@/utils/trpc/react";
import type { RouterInputs, RouterOutputs } from "@/utils/trpc/shared";

import { TablePagination } from "../TablePagination";
import { CategoriesActions } from "./CategoriesActions";
import { NewActions } from "./NewActions";

import Link from "next/link";

import {
	Avatar,
	Button,
	Chip,
	Dropdown,
	DropdownItem,
	DropdownMenu,
	DropdownTrigger,
	Image,
	Input,
	Pagination,
	Select,
	SelectItem,
	type Selection,
	type SortDescriptor,
	Spinner,
	Table,
	TableBody,
	TableCell,
	TableColumn,
	TableHeader,
	TableRow,
	Tooltip,
	User,
} from "@nextui-org/react";
import type { TrangThai } from "@prisma/client";

import { ChevronDown, ChevronDownIcon, Plus, RotateCcw, SearchIcon } from "lucide-react";
import { type ChangeEvent, useCallback, useMemo, useState } from "react";
import toast from "react-hot-toast";

export type newType = RouterOutputs["admin"]["getNews"]["data"][number];

const allColumns: { name: string; uid: keyof newType | "Actions"; sortable?: boolean }[] = [
	{ name: "ID", uid: "MaBanTin", sortable: true },
	{ name: "Bản Tin", uid: "TenBanTin", sortable: true },
	{ name: "Danh Mục", uid: "TenDanhMuc", sortable: true },
	{ name: "Trạng thái", uid: "TrangThai", sortable: true },
	{ name: "Nhân viên", uid: "MaNhanVien", sortable: true },
	{ name: "Ngày Đăng", uid: "NgayDang", sortable: true },
	{ name: "Hành Động", uid: "Actions" },
];

const INITIAL_VISIBLE_COLUMNS: (typeof allColumns)[number]["uid"][] = ["TenBanTin", "TrangThai", "MaNhanVien", "Actions"];

const queryType: Array<{
	key: `Search-${NonNullable<RouterInputs["admin"]["getNews"]["query"]>["valueType"]}`;
	value: string;
}> = [
	{ key: "Search-ID", value: "Mã ID" },
	{ key: "Search-Name", value: "Tên bản tin" },
	{ key: "Search-NoiDung", value: "Nội dung" },
];

const status: Record<TrangThai, string> = {
	APPROVED: "Đã được chấp thuận",
	UNAPPROVED: "Không được chấp thuận",
	WAITING: "Đang chờ xét duyệt",
	FINISHED: "Đã hoàn thành",
	UNFINISHED: "Chưa hoàn thành",
};

const perPage = [6, 12, 18, 25, 50] as const;

type PropsType = {
	user: NonNullable<RouterOutputs["admin"]["getCurrentUser"]>;
	initialNews: RouterOutputs["admin"]["getNews"];
	initialCategories: RouterOutputs["common"]["getCategories"];
	staff?: RouterOutputs["admin"]["getUsers"];
};

export const NewsTable = ({ initialNews, user, initialCategories, staff }: PropsType) => {
	const [page, setPage] = useState(1);
	const [rowsPerPage, setRowPerPage] = useState<(typeof perPage)[number]>(6);

	const [queryNews, setQueryNews] = useState<{
		valueType: (typeof queryType)[number]["key"];
		value: string;
		queryStatus: TrangThai[];
		queryCategories: string[];
		queryStaff: string[];
	}>({
		valueType: "Search-Name",
		value: "",
		queryStatus: [],
		queryCategories: [],
		queryStaff: [],
	});

	const {
		data: news,
		isRefetching,
		refetch: refetchData,
	} = api.admin.getNews.useQuery(
		{
			pageNum: page,
			perPage: rowsPerPage,
			query: {
				queryStatus: queryNews.queryStatus,
				queryCategories: queryNews.queryCategories,
				queryStaff: queryNews.queryStaff,

				value: queryNews.value,
				valueType: queryNews.valueType.slice("Search-".length) as NonNullable<
					RouterInputs["admin"]["getNews"]["query"]
				>["valueType"],
			},
		},
		{
			initialData: initialNews,
			refetchOnReconnect: false,
			refetchOnWindowFocus: false,
			onError: ({ message }) => toast.error("Lỗi: " + message),
			onSuccess: () => {
				const totalPages = Math.ceil(news.count / rowsPerPage);
				if (page > totalPages) setPage(totalPages);
			},
		},
	);

	const { data: categories, refetch: refetchCategories } = api.common.getCategories.useQuery(undefined, {
		initialData: initialCategories,
		refetchOnReconnect: false,
		refetchOnWindowFocus: false,
		onError: ({ message }) => toast.error("Lỗi: " + message),
	});

	const [visibleColumns, setVisibleColumns] = useState<Selection>(new Set(INITIAL_VISIBLE_COLUMNS));
	const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({ column: "TenBanTin", direction: "ascending" });

	const hasSearchFilter = Boolean(queryNews.value) || Boolean(queryNews.queryStatus);

	const headerColumns = useMemo(() => {
		if (visibleColumns === "all") return allColumns;

		return allColumns.filter((column) => Array.from(visibleColumns).includes(column.uid));
	}, [visibleColumns]);

	const pages = Math.ceil(news.count / rowsPerPage);

	const sortedItems = useMemo(() => {
		if (isRefetching) return [];

		return [...news.data].sort((a, b) => {
			const first = a[sortDescriptor.column as keyof newType];
			const second = b[sortDescriptor.column as keyof newType];

			let cmp;

			if (first === null) cmp = -1;
			else if (second === null) cmp = 1;
			else cmp = first < second ? -1 : first > second ? 1 : 0;

			return sortDescriptor.direction === "descending" ? -cmp : cmp;
		});
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [sortDescriptor, news.data, isRefetching]);

	const onRowsPerPageChange = useCallback((e: ChangeEvent<HTMLSelectElement>) => {
		setRowPerPage(Number(e.target.value.slice("per-page-".length)) as typeof rowsPerPage);
		setPage(1);
	}, []);

	const onSearchChange = useCallback((value?: string) => {
		if (value) {
			setQueryNews((prev) => ({ ...prev, value }));
			setPage(1);
		} else {
			setQueryNews((prev) => ({ ...prev, value: "" }));
		}
	}, []);

	const onClear = useCallback(() => {
		setQueryNews((prev) => ({ ...prev, queryCategories: [], queryStaff: [], queryStatus: [], value: "" }));
		setPage(1);
	}, []);

	const topContent = useMemo(() => {
		return (
			<div className="flex flex-col gap-4">
				<div className="flex items-end justify-between gap-3">
					<Select
						size="lg"
						defaultSelectedKeys={["Search-Name"]}
						value={queryNews.value}
						labelPlacement="outside"
						classNames={{ base: "w-1/4", value: "text-small" }}
						items={queryType}
						onChange={(e) => {
							setQueryNews((prev) => ({
								...prev,
								valueType: e.target.value as typeof queryNews.valueType,
							}));
						}}
					>
						{(item) => <SelectItem key={item.key}>{item.value}</SelectItem>}
					</Select>

					<Input
						size="sm"
						radius="lg"
						isClearable
						className="w-full"
						placeholder="Tìm kiếm..."
						startContent={<SearchIcon />}
						value={queryNews.value}
						onClear={() => onClear()}
						onValueChange={onSearchChange}
					/>

					<Dropdown>
						<DropdownTrigger className="hidden sm:flex">
							<Button size="lg" className="text-small" endContent={<ChevronDownIcon />} variant="flat">
								Cột
							</Button>
						</DropdownTrigger>
						<DropdownMenu
							disallowEmptySelection
							aria-label="Table Columns"
							closeOnSelect={false}
							selectedKeys={visibleColumns}
							selectionMode="multiple"
							onSelectionChange={setVisibleColumns}
						>
							{allColumns.map((column) => (
								<DropdownItem key={column.uid} className="capitalize">
									{column.name}
								</DropdownItem>
							))}
						</DropdownMenu>
					</Dropdown>

					{["NhanVien", "QuanTriVien"].includes(user.VaiTro) && (
						<Button
							size="lg"
							isIconOnly
							startContent={<Plus size={20} />}
							color="success"
							as={Link}
							href="/admin/manage/news/create"
						/>
					)}
				</div>

				<div
					className={cn("grid gap-2", {
						"grid-cols-[minmax(0,1fr),minmax(0,1fr),minmax(0,1fr),max-content]": typeof staff !== "undefined",
						"grid-cols-[minmax(0,1fr),minmax(0,1fr),max-content]": typeof staff === "undefined",
					})}
				>
					{staff && (
						<Select
							size="sm"
							radius="lg"
							label="Phân loại nhân viên"
							selectionMode="multiple"
							items={staff.data}
							classNames={{ popoverContent: "min-w-max" }}
							onChange={(e) => {
								setQueryNews((prev) => ({ ...prev, queryStaff: e.target.value.split(",").filter((role) => role.length) }));
							}}
						>
							{(item) => (
								<SelectItem key={item.MaTaiKhoan} textValue={item.TenTaiKhoan ?? undefined}>
									<div className="flex items-center gap-2">
										<Avatar
											alt={item.TenTaiKhoan ?? undefined}
											className="flex-shrink-0"
											size="sm"
											src={item.AnhDaiDien}
										/>
										<div className="flex flex-col">
											<span className="text-small">{item.TenTaiKhoan}</span>
											<span className="text-tiny text-default-400">{item.Email}</span>
										</div>
									</div>
								</SelectItem>
							)}
						</Select>
					)}

					<Select
						size="sm"
						radius="lg"
						classNames={{ popoverContent: "min-w-max" }}
						label="Phân loại trạng thái"
						selectionMode="multiple"
						onChange={(e) => {
							const data = e.target.value
								.split(",")
								.filter((role) => role.length)
								.map((role) => role.slice("select-".length) as TrangThai);

							setQueryNews((prev) => ({ ...prev, queryStatus: data.length > 0 ? data : [] }));
						}}
					>
						{ObjectKeys(status).map((trangThai) => {
							return (
								<SelectItem key={["select", trangThai].join("-")} value={trangThai}>
									{status[trangThai]}
								</SelectItem>
							);
						})}
					</Select>

					<div className="flex">
						<Select
							size="sm"
							radius="lg"
							label="Phân danh mục"
							selectionMode="multiple"
							classNames={{
								base: "min-w-0 flex-grow-0",
								trigger: cn({ "rounded-r-none": user.VaiTro === "QuanTriVien" || user.VaiTro === "TongBienTap" }),
							}}
							onChange={(e) => {
								const data = e.target.value
									.split(",")
									.filter((type) => type.length)
									.map((type) => type.slice("select-".length));

								setQueryNews((prev) => ({ ...prev, queryCategories: data.length > 0 ? data : [] }));
							}}
						>
							{categories.map((category) => {
								return (
									<SelectItem key={["select", category.MaDanhMuc].join("-")} value={category.MaDanhMuc}>
										{category.TenDanhMuc}
									</SelectItem>
								);
							})}
						</Select>

						{(user.VaiTro === "QuanTriVien" || user.VaiTro === "TongBienTap") && (
							<CategoriesActions
								refetch={async () => await Promise.allSettled([refetchData(), refetchCategories()])}
								categories={categories}
							/>
						)}
					</div>

					<Button
						size="lg"
						isIconOnly
						startContent={
							<RotateCcw
								size={20}
								className={cn(`transition-transform duration-1000 ease-linear will-change-transform`, {
									"-rotate-[360deg]": isRefetching,
								})}
							/>
						}
						// eslint-disable-next-line @typescript-eslint/no-misused-promises
						onPress={async () => await Promise.allSettled([refetchData()])}
					/>
				</div>
			</div>
		);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [queryNews, visibleColumns, onSearchChange, onRowsPerPageChange, news.count, hasSearchFilter, isRefetching]);

	const bottomContent = useMemo(() => {
		return (
			<div className="flex items-center justify-between">
				<section className="flex items-center justify-center gap-2 whitespace-nowrap text-small text-default-400">
					<span>Hiển thị</span>

					<Select
						size="sm"
						onChange={onRowsPerPageChange}
						defaultSelectedKeys={["per-page-" + rowsPerPage]}
						items={perPage.map((num) => ({ key: "per-page-" + num, value: String(num) }))}
						selectorIcon={<ChevronDown />}
						classNames={{
							label: "whitespace-nowrap",
							base: "w-[70px]",
							trigger: "h-max min-h-0",
							popoverContent: "w-max",
						}}
					>
						{(item) => (
							<SelectItem key={item.key} className="px-1.5 py-1">
								{item.value}
							</SelectItem>
						)}
					</Select>

					<span>trong tổng số {news.count} bản tin.</span>
				</section>

				<TablePagination data={news} isRefetching={isRefetching} page={page} rowsPerPage={rowsPerPage} setPage={setPage} />
			</div>
		);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [page, pages, isRefetching, news.count]);

	const renderCell = useCallback((banTin: newType, columnKey: (typeof allColumns)[number]["uid"]) => {
		let cellValue = banTin[columnKey as keyof newType];

		// * NOTE: Prevent typescript from being mad
		if (typeof cellValue === "object") cellValue = "";

		switch (columnKey) {
			case "TenBanTin": {
				const banTinPath = encodeBanTinPath(banTin);

				return (
					<div className="flex gap-4">
						<Link href={banTinPath}>
							<Image
								classNames={{ wrapper: "aspect-video w-40", img: "w-full h-full object-center object-cover" }}
								src={banTin.PreviewImage}
								alt={banTin.NoiDungTomTat}
								width="144"
								height="81"
							/>
						</Link>

						<Link href={banTinPath}>
							<div className="flex max-w-sm flex-col justify-between gap-1">
								<h3 className="text-lg font-semibold">{banTin.TenBanTin}</h3>
								<span className="line-clamp-2 text-sm">{banTin.NoiDungTomTat}</span>
							</div>
						</Link>
					</div>
				);
			}

			case "TrangThai": {
				const trangThai = cellValue as keyof typeof status;

				return (
					<div className="flex items-center justify-center">
						<Chip
							color={cn<"default" | "primary" | "warning" | "danger" | "success">({
								success: trangThai === "APPROVED",
								danger: trangThai === "UNAPPROVED",
								warning: trangThai === "WAITING",
								primary: trangThai === "FINISHED",
								default: trangThai === "UNFINISHED",
							})}
						>
							{status[trangThai]}
						</Chip>
					</div>
				);
			}

			case "MaNhanVien": {
				return (
					<User
						name={banTin.NhanVien.TaiKhoan.TenTaiKhoan}
						description={banTin.NhanVien.TaiKhoan.Email}
						avatarProps={{ showFallback: true, src: banTin.NhanVien.TaiKhoan.AnhDaiDien }}
					/>
				);
			}

			case "NgayDang": {
				const date = dayjs(banTin.NgayDang);

				return (
					<Tooltip showArrow content={date.format("DD MMMM, YYYY, HH:mm")}>
						<span>{date.fromNow()}</span>
					</Tooltip>
				);
			}

			case "Actions": {
				return (
					<NewActions user={user} banTin={banTin} refetch={async () => await Promise.all([refetchData(), refetchCategories()])} />
				);
			}

			default:
				return cellValue;
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<Table
			isHeaderSticky
			bottomContent={bottomContent}
			bottomContentPlacement="outside"
			sortDescriptor={sortDescriptor}
			topContent={topContent}
			topContentPlacement="outside"
			onSortChange={setSortDescriptor}
			classNames={{ base: "flex-grow", wrapper: "flex-grow", table: "w-max" }}
		>
			<TableHeader columns={headerColumns}>
				{(column) => (
					<TableColumn
						key={column.uid as string}
						allowsSorting={column.sortable}
						className={cn({ "text-right": column.uid === "Actions", "text-center": column.uid === "TrangThai" })}
					>
						{column.name}
					</TableColumn>
				)}
			</TableHeader>

			<TableBody
				isLoading={isRefetching}
				loadingContent={<Spinner label="Đang tải..." />}
				emptyContent={isRefetching ? undefined : "Không tìm thấy bản tin nào"}
				items={sortedItems}
			>
				{(item) => (
					<TableRow key={item.MaBanTin}>
						{(columnKey) => <TableCell>{renderCell(item, columnKey as (typeof allColumns)[number]["uid"])}</TableCell>}
					</TableRow>
				)}
			</TableBody>
		</Table>
	);
};
