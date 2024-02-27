"use client";

import { ObjectKeys, cn } from "@/utils/common";
import { dayjs } from "@/utils/dayjs";
import { api } from "@/utils/trpc/react";
import type { RouterInputs, RouterOutputs } from "@/utils/trpc/shared";

import { TablePagination } from "../TablePagination";
import { UserActions } from "./UserActions";

import {
	Button,
	Chip,
	Dropdown,
	DropdownItem,
	DropdownMenu,
	DropdownTrigger,
	Input,
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
import type { Role } from "@prisma/client";

import { ChevronDown, ChevronDownIcon, RotateCcw, SearchIcon } from "lucide-react";
import { type ChangeEvent, useCallback, useMemo, useState } from "react";
import toast from "react-hot-toast";

export type UserType = RouterOutputs["admin"]["getUsers"]["data"][number];

const allColumns: { name: string; uid: keyof UserType | "Actions"; sortable?: boolean }[] = [
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

const INITIAL_VISIBLE_COLUMNS: (typeof allColumns)[number]["uid"][] = ["TenTaiKhoan", "Banned", "VaiTro", "NgayTaoTK", "Actions"];

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
			initialData: initialUsers,
			refetchOnReconnect: false,
			refetchOnWindowFocus: false,
			onError: ({ message }) => toast.error("Lỗi: " + message),
			onSuccess: () => {
				const totalPages = Math.ceil(users.count / rowsPerPage);
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

	const sortedItems = useMemo(() => {
		if (isRefetching) return [];

		return [...users.data].sort((a, b) => {
			const first = a[sortDescriptor.column as keyof UserType];
			const second = b[sortDescriptor.column as keyof UserType];

			let cmp;

			if (first === null) cmp = -1;
			else if (second === null) cmp = 1;
			else cmp = first < second ? -1 : first > second ? 1 : 0;

			return sortDescriptor.direction === "descending" ? -cmp : cmp;
		});
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [sortDescriptor, users.data, isRefetching]);

	const onRowsPerPageChange = useCallback((e: ChangeEvent<HTMLSelectElement>) => {
		setRowPerPage(Number(e.target.value.slice("per-page-".length)) as typeof rowsPerPage);
		setPage(1);
	}, []);

	const onQueryChange = useCallback((key: keyof typeof queryUsers, value?: string | unknown[]) => {
		if ((typeof value === "string" && value) || (Array.isArray(value) && value.length > 0)) {
			setQueryUsers((prev) => ({ ...prev, [key]: value }));
			setPage(1);
		} else {
			setQueryUsers((prev) => {
				if (typeof prev[key] === "string") return { ...prev, [key]: "" };
				if (Array.isArray(prev[key])) return { ...prev, [key]: [] };

				return prev;
			});
			setPage(1);
		}
	}, []);

	const topContent = useMemo(() => {
		return (
			<div className="flex flex-col gap-4">
				<div className="flex items-end justify-between gap-3">
					<Select
						size="lg"
						defaultSelectedKeys={["Search-Name"]}
						value={queryUsers.value}
						labelPlacement="outside"
						classNames={{ base: "w-1/4", value: "text-small" }}
						items={queryType}
						onChange={(e) => onQueryChange("type", e.target.value)}
					>
						{(item) => <SelectItem key={item.key}>{item.value}</SelectItem>}
					</Select>

					<Input
						size="sm"
						isClearable
						radius="lg"
						className="w-full"
						placeholder="Tìm kiếm..."
						startContent={<SearchIcon />}
						value={queryUsers.value}
						onClear={() => onQueryChange("value")}
						onValueChange={(value) => onQueryChange("value", value)}
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
				</div>

				<div className="flex gap-2">
					<Select
						size="sm"
						radius="lg"
						label="Phân loại chức vụ"
						selectionMode="multiple"
						className="flex-grow"
						onChange={(e) => {
							const data = e.target.value
								.replaceAll("select-", "")
								.split(",")
								.filter((role) => role.length);

							onQueryChange("queryRoles", data);
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
						onPress={async () => await Promise.allSettled([refetchData()])}
					/>
				</div>
			</div>
		);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [queryUsers, visibleColumns, onQueryChange, onRowsPerPageChange, users.count, hasSearchFilter, isRefetching]);

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
							popoverContent: "min-w-max",
						}}
					>
						{(item) => (
							<SelectItem key={item.key} className="px-1.5 py-1">
								{item.value}
							</SelectItem>
						)}
					</Select>

					<span>trong tổng số {users.count} người dùng</span>
				</section>

				<TablePagination data={users} isRefetching={isRefetching} page={page} rowsPerPage={rowsPerPage} setPage={setPage} />
			</div>
		);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [page, isRefetching, users.count]);

	const renderCell = useCallback(
		(user: UserType, columnKey: (typeof allColumns)[number]["uid"]) => {
			let cellValue = user[columnKey as keyof UserType];

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
							radius="lg"
							disabledKeys={
								currentUser.VaiTro === "QuanTriVien" ? ["Update-QuanTriVien"] : ["Update-TongBienTap", "Update-QuanTriVien"]
							}
							defaultSelectedKeys={[["Update", user.VaiTro].join("-")]}
							isDisabled={user.MaTaiKhoan === currentUser.MaTaiKhoan || user.Banned}
							classNames={{ popoverContent: "min-w-max" }}
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

				case "NgayTaoTK": {
					const date = dayjs(user.NgayTaoTK);

					return (
						<Tooltip showArrow content={date.format("DD MMMM, YYYY, HH:mm")}>
							<span>{date.fromNow()}</span>
						</Tooltip>
					);
				}

				case "Banned":
					return (
						<div className="flex w-full items-center justify-center">
							<Chip
								className="capitalize"
								color={cn<"success" | "danger">({ success: !user.Banned, danger: user.Banned })}
								size="sm"
								variant="flat"
							>
								{user.Banned ? "Cấm hoạt động" : "Hoạt động"}
							</Chip>
						</div>
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
				emptyContent={isRefetching ? undefined : "Không tìm thấy người dùng nào"}
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
