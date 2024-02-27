"use client";

import { cn } from "@/utils/common";
import { dayjs } from "@/utils/dayjs";
import { encodeBanTinPath } from "@/utils/path";
import { api } from "@/utils/trpc/react";
import type { RouterOutputs } from "@/utils/trpc/shared";

import { ChiaSeDropdown } from "../chiaSeDropdown";

import Link from "next/link";

import { Button, Card, CardBody, CardFooter, CardHeader, Divider, Image, Pagination, Spinner, User } from "@nextui-org/react";

import { Eye, MessagesSquare } from "lucide-react";
import { type ReactNode, useCallback, useState } from "react";

const perPageArray = [6, 12, 18] as const;

export const BanTin = ({
	initialFavorites,
	initialHistories,
	children,
}: {
	initialHistories?: RouterOutputs["user"]["getHistoris"];
	initialFavorites?: RouterOutputs["user"]["getFavorites"];
	children: React.ReactNode;
}) => {
	const [page, setPage] = useState(1);
	const [rowsPerPage] = useState<(typeof perPageArray)[number]>(6);

	return (
		<Card className="flex-1">
			{initialFavorites && (
				<FavoriteNews initialData={initialFavorites} page={page} setPage={setPage} rowsPerPage={rowsPerPage}>
					{children}
				</FavoriteNews>
			)}
			{initialHistories && (
				<HistoryNews initialData={initialHistories} page={page} setPage={setPage} rowsPerPage={rowsPerPage}>
					{children}
				</HistoryNews>
			)}
		</Card>
	);
};

interface NewsType<T> {
	initialData: T;
	page: number;
	rowsPerPage: number;
	setPage: (page: number) => void;
	children: ReactNode;
}

const FavoriteNews = ({ initialData, page, rowsPerPage, setPage, children }: NewsType<RouterOutputs["user"]["getFavorites"]>) => {
	const {
		data: news,
		isRefetching,
		refetch,
	} = api.user.getFavorites.useQuery(
		{ pageNum: page, perPage: rowsPerPage },
		{ placeholderData: initialData, refetchOnMount: false, refetchOnWindowFocus: false },
	);

	return (
		<>
			<CardHeader>
				<h2 className="flex w-full items-center justify-center gap-2 text-2xl font-semibold">
					{children} ({news!.count ?? 0})
				</h2>
			</CardHeader>

			<CardBody className={cn("gap-4", { "items-center justify-center": isRefetching })}>
				{!isRefetching &&
					news!.data.map((banTin, index, array) => {
						return (
							<>
								<BanTinItem key={banTin.MaBanTin} banTin={banTin} refetch={async () => await refetch()} />
								{index < array.length - 1 && <Divider />}
							</>
						);
					})}

				{isRefetching && <Spinner color="primary" label="Đang tải..." />}
			</CardBody>

			<BottomFooter page={page} setPage={setPage} totals={news!.count} isRefetching={isRefetching} rowsPerPage={rowsPerPage} />
		</>
	);
};

const HistoryNews = ({ initialData, page, rowsPerPage, setPage, children }: NewsType<RouterOutputs["user"]["getHistoris"]>) => {
	const { data: news, isRefetching } = api.user.getHistoris.useQuery(
		{ pageNum: page, perPage: rowsPerPage },
		{ placeholderData: initialData, refetchOnMount: false, refetchOnWindowFocus: false },
	);

	return (
		<>
			<CardHeader>
				<h2 className="flex w-full items-center justify-center gap-2 text-2xl font-semibold">
					{children} ({news!.count || 0})
				</h2>
			</CardHeader>

			<CardBody className={cn("gap-4", { "items-center justify-center": isRefetching })}>
				{!isRefetching &&
					news!.data.map((banTin, index, array) => {
						return (
							<>
								<BanTinItem key={banTin.MaBanTin} banTin={banTin} />
								{index < array.length - 1 && <Divider />}
							</>
						);
					})}

				{isRefetching && <Spinner color="primary" label="Đang tải..." />}
			</CardBody>

			<BottomFooter page={page} setPage={setPage} totals={news!.count} isRefetching={isRefetching} rowsPerPage={rowsPerPage} />
		</>
	);
};

type BanTinType = Omit<
	RouterOutputs["user"]["getFavorites"]["data"][number] & RouterOutputs["user"]["getHistoris"]["data"][number],
	"FavoredAt" | "ReadAt"
> & {
	FavoredAt?: Date;
	ReadAt?: Date;
};

const BanTinItem = ({ banTin, refetch }: { banTin: BanTinType; refetch?: () => Promise<unknown> }) => {
	const banTinPath = encodeBanTinPath({ MaBanTin: banTin.MaBanTin, TenBanTin: banTin.BanTin.TenBanTin });

	return (
		<div className="flex flex-col gap-4">
			<Link className="flex gap-4" href={banTinPath}>
				<Image
					src={banTin.BanTin.PreviewImage}
					alt={banTin.BanTin.NoiDungTomTat}
					width="160"
					height="90"
					classNames={{
						wrapper: "block aspect-video h-auto w-40 flex-shrink-0",
						img: "w-full h-full object-center object-cover",
					}}
				/>
				<div className="flex flex-grow flex-col items-start justify-between">
					<h3 className="font-semibold">{banTin.BanTin.TenBanTin}</h3>
					<p className="line-clamp-2">{banTin.BanTin.NoiDungTomTat}</p>
				</div>
			</Link>

			<section className="flex gap-4">
				<span className="w-40">
					<User
						name={banTin.BanTin.NhanVien.TaiKhoan.TenTaiKhoan}
						avatarProps={{ showFallback: true, size: "sm", src: banTin.BanTin.NhanVien.TaiKhoan.AnhDaiDien }}
					/>
				</span>

				<div className="flex flex-grow items-center justify-between">
					<div className="flex items-center justify-center gap-2">
						<span className="font-semibold text-danger">{banTin.BanTin.DanhMuc.TenDanhMuc}</span>
						<span> - </span>
						<span>{dayjs(banTin.FavoredAt ?? banTin.ReadAt).fromNow()}</span>
						<span> - </span>
						<span className="flex items-center gap-2">
							<MessagesSquare size={20} /> {banTin.BanTin._count.DanhGia}
						</span>
						<span> - </span>
						<span className="flex items-center gap-2">
							<Eye size={20} /> {banTin.BanTin.LuoiXem}
						</span>
					</div>

					<ChiaSeDropdown
						duongDanBanTin={banTinPath}
						tenBanTin={banTin.BanTin.TenBanTin}
						maBanTin={banTin.MaBanTin}
						refetch={refetch}
					/>
				</div>
			</section>
		</div>
	);
};

const BottomFooter = ({
	page,
	setPage,
	totals,
	isRefetching,
	rowsPerPage,
}: {
	page: number;
	setPage: (page: number) => void;
	totals: number;
	isRefetching: boolean;
	rowsPerPage: number;
}) => {
	const pages = Math.ceil(totals / rowsPerPage);

	const onNextPage = useCallback(() => {
		if (page < pages) {
			setPage(page + 1);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [page, pages]);

	const onPreviousPage = useCallback(() => {
		if (page > 1) {
			setPage(page - 1);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [page]);

	if (pages === 0) return;

	return (
		<CardFooter className="justify-between">
			<Button isDisabled={pages === 1 || isRefetching} color="primary" onPress={onPreviousPage}>
				Previous
			</Button>

			<Pagination isDisabled={isRefetching} showShadow color="primary" page={page} total={pages} onChange={setPage} />

			<Button isDisabled={pages === 1 || isRefetching} color="primary" onPress={onNextPage}>
				Next
			</Button>
		</CardFooter>
	);
};
