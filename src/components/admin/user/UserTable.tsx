"use client";

import { ObjectKeys, cn } from "@/utils/common";
import { dayjs } from "@/utils/dayjs";
import { api } from "@/utils/trpc/react";
import type { RouterInputs, RouterOutputs } from "@/utils/trpc/shared";

import { UserActions } from "./UserActions";

import {
	Button,
	Chip,
	Dropdown,
	DropdownItem,
	DropdownMenu,
	DropdownTrigger,
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
	User,
} from "@nextui-org/react";
import type { Role } from "@prisma/client";

import { ChevronDownIcon, RotateCcw, SearchIcon } from "lucide-react";
import { type ChangeEvent, useCallback, useMemo, useState } from "react";
import toast from "react-hot-toast";

export type userType = RouterOutputs["admin"]["getUsers"]["data"][number];

const allColumns: { name: string; uid: keyof userType | "Actions"; sortable?: boolean }[] = [
	{ name: "ID", uid: "MaTaiKhoan", sortable: true },
	{ name: "Người dùng", uid: "TenTaiKhoan", sortable: true },
	{ name: "Số DT", uid: "SoDT", sortable: true },
	{ name: "Trạng thái", uid: "Banned", sortable: true },
	{ name: "Chức Vụ", uid: "VaiTro", sortable: true },
	{ name: "Ngày Tham Gia", uid: "NgayTaoTK", sortable: true },
	{ name: "Hành Động", uid: "Actions" },
];

const roles: Record<Role, string> = {
	KhachHang: "Khách hàng",
	NhanVien: "Nhân viên",
	TongBienTap: "Tổng Biên Tập",
	QuanTriVien: "Quản trị viên",
};

const INITIAL_VISIBLE_COLUMNS: (typeof allColumns)[number]["uid"][] = ["TenTaiKhoan", "Banned", "VaiTro", "Actions"];

const queryType: Array<{
	key: `Search-${NonNullable<RouterInputs["admin"]["getUsers"]["query"]>["valueType"]}`;
	value: string;
}> = [
	{ key: "Search-ID", value: "Mã ID" },
	{ key: "Search-Name", value: "Tên tài khoản" },
	{ key: "Search-Email", value: "Email" },
	{ key: "Search-SDT", value: "Số điên thoại" },
];

const perPage = [6, 12, 18] as const;

export const UserTable = ({
	initialUsers,
	currentUser,
}: {
	initialUsers: RouterOutputs["admin"]["getUsers"];
	currentUser: NonNullable<RouterOutputs["admin"]["getCurrentUser"]>;
}) => {
	const [page, setPage] = useState(1);
	const [rowsPerPage, setRowPerPage] = useState<(typeof perPage)[number]>(6);

	const [queryUsers, setQueryUsers] = useState<{
		type: (typeof queryType)[number]["key"];
		value: string;
		queryRoles: Role[];
	}>({
		type: "Search-Name",
		value: "",
		queryRoles: [],
	});

	const {
		data: users,
		isRefetching,
		refetch: refetchData,
	} = api.admin.getUsers.useQuery(
		{
			pageNum: page,
			perPage: rowsPerPage,
			query: {
				queryRoles: queryUsers.queryRoles,
				value: queryUsers.value,
				valueType: queryUsers.type.slice("Search-".length) as NonNullable<RouterInputs["admin"]["getUsers"]["query"]>["valueType"],
			},
		},
		{
			placeholderData: initialUsers,
			refetchOnReconnect: false,
			refetchOnWindowFocus: false,
			keepPreviousData: true,
			onError: ({ message }) => toast.error("Lỗi: " + message),
			onSuccess: () => {
				const totalPages = Math.ceil(users!.count / rowsPerPage);
				if (page > totalPages) setPage(totalPages);
			},
		},
	);

	const updateUser = api.admin.updateUser.useMutation({
		onSuccess: async () => refetchData(),
	});

	const [visibleColumns, setVisibleColumns] = useState<Selection>(new Set(INITIAL_VISIBLE_COLUMNS));
	const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
		column: "age",
		direction: "ascending",
	});

	const hasSearchFilter = Boolean(queryUsers.value) || Boolean(queryUsers.queryRoles);

	const headerColumns = useMemo(() => {
		if (visibleColumns === "all") return allColumns;

		return allColumns.filter((column) => Array.from(visibleColumns).includes(column.uid));
	}, [visibleColumns]);

	const pages = Math.ceil(users!.count / rowsPerPage);

	const sortedItems = useMemo(() => {
		return [...users!.data].sort((a, b) => {
			const first = a[sortDescriptor.column as keyof userType];
			const second = b[sortDescriptor.column as keyof userType];

			let cmp;

			if (first === null) cmp = -1;
			else if (second === null) cmp = 1;
			else cmp = first < second ? -1 : first > second ? 1 : 0;

			return sortDescriptor.direction === "descending" ? -cmp : cmp;
		});
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [sortDescriptor, users!.data]);

	const onRowsPerPageChange = useCallback((e: ChangeEvent<HTMLSelectElement>) => {
		setRowPerPage(Number(e.target.value.slice("per-page-".length)) as typeof rowsPerPage);
		setPage(1);
	}, []);

	const onSearchChange = useCallback((value?: string) => {
		if (value) {
			setQueryUsers((prev) => ({ ...prev, value }));
			setPage(1);
		} else {
			setQueryUsers((prev) => ({ ...prev, value: "" }));
		}
	}, []);

	const onClear = useCallback(() => {
		setQueryUsers((prev) => ({ ...prev, value: "", queryRoles: [] }));
		setPage(1);
	}, []);

	const topContent = useMemo(() => {
		return (
			<div className="flex flex-col gap-4">
				<div className="flex items-end justify-between gap-3">
					<div className="flex w-full gap-2">
						<Select
							defaultSelectedKeys={["Search-Name"]}
							value={queryUsers.value}
							labelPlacement="outside"
							classNames={{ base: "w-1/4" }}
							items={queryType}
							onChange={(e) => {
								setQueryUsers((prev) => ({
									...prev,
									type: e.target.value as typeof queryUsers.type,
								}));
							}}
						>
							{(item) => <SelectItem key={item.key}>{item.value}</SelectItem>}
						</Select>

						<Input
							isClearable
							className="w-full"
							placeholder="Tìm kiếm..."
							startContent={<SearchIcon />}
							value={queryUsers.value}
							onClear={() => onClear()}
							onValueChange={onSearchChange}
						/>
					</div>

					<div className="flex gap-3">
						<Dropdown>
							<DropdownTrigger className="hidden sm:flex">
								<Button endContent={<ChevronDownIcon className="text-small" />} variant="flat">
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
					</div>
				</div>

				<div className="flex items-center justify-between">
					<span className="text-small text-default-400">Tổng {users!.count} người dùng</span>

					<div>
						<Select
							size="sm"
							labelPlacement="outside-left"
							onChange={onRowsPerPageChange}
							defaultSelectedKeys={["per-page-" + rowsPerPage]}
							label="Cột từng trang"
							items={perPage.map((num) => ({ key: "per-page-" + num, value: String(num) }))}
							classNames={{
								label: "flex items-center h-8 whitespace-nowrap text-sm",
								base: "w-[180px]",
							}}
						>
							{(item) => <SelectItem key={item.key}>{item.value}</SelectItem>}
						</Select>
					</div>
				</div>

				<div className="flex gap-2">
					<Select
						size="sm"
						label="Phân loại chức vụ"
						selectionMode="multiple"
						className="flex-grow"
						onChange={(e) => {
							const data = e.target.value
								.split(",")
								.filter((role) => role.length)
								.map((role) => role.slice("select-".length) as Role);

							setQueryUsers((prev) => ({ ...prev, queryRoles: data.length > 0 ? data : [] }));
						}}
					>
						{ObjectKeys(roles).map((role) => {
							return (
								<SelectItem key={["select", role].join("-")} value={role}>
									{roles[role]}
								</SelectItem>
							);
						})}
					</Select>

					<Button
						size="lg"
						isIconOnly
						startContent={
							<RotateCcw
								size={20}
								className={cn(`rotate-0 transition-transform duration-1000 ease-linear will-change-transform`, {
									"-rotate-[360deg]": isRefetching,
								})}
							/>
						}
						// eslint-disable-next-line @typescript-eslint/no-misused-promises
						onClick={async () => {
							await Promise.allSettled([refetchData()]);
						}}
					/>
				</div>
			</div>
		);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [queryUsers, visibleColumns, onSearchChange, onRowsPerPageChange, users!.count, hasSearchFilter, isRefetching]);

	const onNextPage = useCallback(() => {
		if (page < pages) {
			setPage(page + 1);
		}
	}, [page, pages]);

	const onPreviousPage = useCallback(() => {
		if (page > 1) {
			setPage(page - 1);
		}
	}, [page]);

	const bottomContent = useMemo(() => {
		return (
			<div className="flex items-center justify-between px-2 py-2">
				<Button isDisabled={pages === 1} color="primary" onPress={onPreviousPage}>
					Previous
				</Button>

				<Pagination isDisabled={isRefetching} showShadow color="primary" page={page} total={pages} onChange={setPage} />

				<Button isDisabled={pages === 1} color="primary" onPress={onNextPage}>
					Next
				</Button>
			</div>
		);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [page, pages, isRefetching, users!.count]);

	const renderCell = useCallback(
		(user: userType, columnKey: (typeof allColumns)[number]["uid"]) => {
			let cellValue = user[columnKey as keyof userType];
			if (cellValue instanceof Date) cellValue = dayjs(cellValue).format("DD/MM/YYYY - HH:mm:ss");

			// * NOTE: Prevent typescript from being mad
			if (typeof cellValue === "object") cellValue = "";

			switch (columnKey) {
				case "TenTaiKhoan":
					return (
						<User
							avatarProps={{ radius: "lg", src: user.AnhDaiDien, showFallback: true }}
							description={user.Email}
							name={user.TenTaiKhoan}
						/>
					);

				case "SoDT":
					if (!cellValue) return "Không có";
					return cellValue;

				case "VaiTro":
					return (
						<Select
							aria-label="Cập nhật chức vụ"
							labelPlacement="outside"
							disabledKeys={
								currentUser.VaiTro === "QuanTriVien" ? ["Update-QuanTriVien"] : ["Update-TongBienTap", "Update-QuanTriVien"]
							}
							defaultSelectedKeys={[["Update", user.VaiTro].join("-")]}
							isDisabled={user.MaTaiKhoan === currentUser.MaTaiKhoan || user.Banned}
							items={ObjectKeys(roles).map((role) => ({
								key: ["Update", role].join("-"),
								value: roles[role],
							}))}
							onChange={(key) => {
								const role = key.target.value.slice("Update-".length) as typeof user.VaiTro;

								updateUser.mutate({
									maTaiKhoan: user.MaTaiKhoan,
									data: { type: "Update", role },
								});
							}}
						>
							{(item) => <SelectItem key={item.key}>{item.value}</SelectItem>}
						</Select>
					);

				case "Banned":
					return (
						<Chip color={cn<"success" | "danger">({ success: !user.Banned, danger: user.Banned })} variant="flat" size="sm">
							{user.Banned ? "Cấm hoạt động" : "Hoạt động"}
						</Chip>
					);

				case "Actions":
					return <UserActions user={user} currentUserId={currentUser.MaTaiKhoan} refetch={async () => await refetchData()} />;

				default:
					return cellValue;
			}
		},
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[],
	);

	return (
		<Table
			isHeaderSticky
			bottomContent={bottomContent}
			bottomContentPlacement="outside"
			sortDescriptor={sortDescriptor}
			topContent={topContent}
			topContentPlacement="outside"
			onSortChange={setSortDescriptor}
			classNames={{ base: "flex-grow", wrapper: "flex-grow" }}
		>
			<TableHeader columns={headerColumns}>
				{(column) => (
					<TableColumn
						key={column.uid as string}
						allowsSorting={column.sortable}
						className={cn({ "text-right": column.uid === "Actions" })}
					>
						{column.name}
					</TableColumn>
				)}
			</TableHeader>

			<TableBody
				isLoading={isRefetching}
				loadingContent={<Spinner label="Đang tải..." />}
				emptyContent={"Không tìm thấy người dùng nào"}
				items={sortedItems}
			>
				{(item) => (
					<TableRow key={item.MaTaiKhoan}>
						{(columnKey) => <TableCell>{renderCell(item, columnKey as (typeof allColumns)[number]["uid"])}</TableCell>}
					</TableRow>
				)}
			</TableBody>
		</Table>
	);
};
