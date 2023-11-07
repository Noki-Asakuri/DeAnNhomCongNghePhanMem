"use client";

import type { layBanTin } from "@/app/bantin/[tenbanTin_maBanTin]/data";
import { dayjs } from "@/utils/dayjs";
import { api } from "@/utils/trpc/react";
import type { RouterOutputs } from "@/utils/trpc/shared";

import { DanhGiaTextArea } from "./DanhGiaTextArea";

import type { User } from "@clerk/clerk-sdk-node";
import { Avatar, Button, Card, CardBody, Spacer, Spinner } from "@nextui-org/react";

import { Flag, MessagesSquare, Reply } from "lucide-react";
import { Fragment, useState } from "react";
import toast from "react-hot-toast";

type ParamsType = {
	banTin: NonNullable<Awaited<ReturnType<typeof layBanTin>>>;
	userJSON: string | null;
};

export const DanhGiaBanTin = ({ banTin, userJSON }: ParamsType) => {
	const user = userJSON ? (JSON.parse(userJSON) as User) : null;

	const [pageNum] = useState(1);

	const {
		data,
		isLoading,
		isSuccess,
		refetch: refetchDanhGia,
	} = api.danhGia.getDanhGia.useQuery({ maBanTin: banTin.MaBanTin, pageNum }, { refetchOnReconnect: false, refetchOnWindowFocus: false });

	if (isLoading) {
		return (
			<div className="flex items-center justify-center pt-4">
				<Spinner label="Đang tải..." color="primary" />
			</div>
		);
	}

	return (
		<div className="flex flex-col gap-4 pt-4">
			{isSuccess && data.length === 0 && (
				<>
					<h3 className="text-2xl font-bold">Đánh Giá</h3>
					<div className="w-full">
						<div className="flex h-full items-center justify-center gap-5">
							<MessagesSquare strokeWidth={2} size={40} />
							<span className="text-xl">Hãy là người đầu tiên bình luận</span>
						</div>
					</div>
				</>
			)}

			{user && (
				<DanhGiaTextArea
					maBanTin={banTin.MaBanTin}
					user={user}
					refetch={async () => {
						await refetchDanhGia();
					}}
				/>
			)}

			{isSuccess && data.length > 0 && (
				<div className="flex flex-col gap-2">
					{data.map((danhGia) => {
						return (
							<DanhGia
								key={danhGia.MaDanhGia}
								danhGia={danhGia}
								user={user}
								isTraLoi={false}
								refetch={async () => {
									await refetchDanhGia();
								}}
							/>
						);
					})}
				</div>
			)}
		</div>
	);
};

type DanhGiaParams = {
	danhGia: RouterOutputs["danhGia"]["getDanhGia"][number];
	refetch: () => Promise<void>;
	user: User | null;
	isTraLoi: boolean;
};

const DanhGia = ({ danhGia, refetch, user: clerkUser, isTraLoi }: DanhGiaParams) => {
	const [isClicked, setClicked] = useState(false);
	const [isExpanded, setExpanded] = useState(false);

	const trpcContext = api.useUtils();

	const traLoi = api.danhGia.getTraLoi.useQuery(
		{ maDanhGia: danhGia.MaDanhGia },
		{ refetchOnReconnect: false, refetchOnWindowFocus: false },
	);

	const xoaDanhGia = api.danhGia.xoaDanhGia.useMutation({
		onSuccess: async () => {
			await Promise.allSettled([
				refetch(),
				traLoi.refetch(),
				trpcContext.danhGia.getTraLoi.refetch({ maDanhGia: danhGia.MaTraLoi ?? danhGia.MaDanhGia }),
			]);
		},
		onError: ({ message }) => {
			toast.error("Lỗi: " + message);
		},
	});

	return (
		<Card isDisabled={xoaDanhGia.isLoading} as={isTraLoi ? Fragment : "div"}>
			<CardBody as={"div"} className={`relative isolate ${isTraLoi && "pb-0 pl-2 pr-0 pt-2"}`}>
				{/* {user.isSuccess && (user.data?.Role === "NhanVien" || user.data?.Role === "QuanTriVien") && (
					<Button
						size="sm"
						isIconOnly
						color="danger"
						isLoading={xoaDanhGia.isLoading}
						className="absolute right-2 top-2 z-20"
						startContent={xoaDanhGia.isLoading ? undefined : <X size={16} />}
						onClick={() => xoaDanhGia.mutate({ maDanhGia: danhGia.MaDanhGia })}
					/>
				)} */}

				<div className="grid grid-cols-[max-content,1fr] gap-x-4">
					<Avatar showFallback src={danhGia.NguoiDung.TaiKhoan.AnhDaiDien} className="row-[span_7_/_span_7]" />

					<div className="flex flex-col gap-1">
						<span className="w-max capitalize"> {danhGia.NguoiDung.TaiKhoan.TenTaiKhoan} </span>
						<p className="text-sm">{danhGia.NoiDung}</p>
					</div>

					<Spacer y={2} />

					<div className="flex items-center justify-between">
						<div className="flex items-center gap-2">
							{clerkUser && (
								<Button
									startContent={<Reply size={16} />}
									size="sm"
									variant="bordered"
									onClick={() => setClicked((p) => !p)}
								>
									Trả lời
								</Button>
							)}

							<Button
								size="sm"
								isIconOnly
								color="danger"
								variant="bordered"
								startContent={<Flag size={16} />}
								title="Báo cáo đánh giá vi phạm"
							/>
						</div>
						<span className="text-sm">{dayjs(danhGia.NgayDanhGia).fromNow()}</span>
					</div>

					{clerkUser && isClicked && (
						<>
							<Spacer y={2} />

							<DanhGiaTextArea
								maBanTin={danhGia.MaBanTin}
								user={clerkUser}
								maTraLoi={danhGia.MaDanhGia}
								refetch={async () => {
									await Promise.allSettled([
										refetch(),
										traLoi.refetch(),
										trpcContext.danhGia.getTraLoi.refetch({
											maDanhGia: danhGia.MaTraLoi ?? danhGia.MaDanhGia,
										}),
									]);

									setClicked(false);
								}}
							/>
						</>
					)}

					{danhGia._count.TraLoiBoi > 0 && (
						<>
							<Spacer y={2} />

							<div>
								<Button
									variant="light"
									size="sm"
									startContent={
										<Reply size={16} className={`transition-transform ${isExpanded ? "-rotate-90" : "-rotate-180"}`} />
									}
									onClick={() => setExpanded((p) => !p)}
								>
									{danhGia._count.TraLoiBoi} trả lời
								</Button>

								{isExpanded && traLoi.isLoading && (
									<>
										<Spacer y={2} />
										<blockquote className="flex flex-col gap-4 border-l-2 border-default-500 pl-4">
											<Spinner color="primary" label="Đang tải..." />
										</blockquote>
									</>
								)}

								{isExpanded && traLoi.isSuccess && (
									<>
										<Spacer y={2} />
										<blockquote className="flex flex-col gap-4 border-l-2 border-default-500 pl-4">
											{traLoi.data?.map((traLoi) => {
												return (
													<DanhGia
														key={traLoi.MaDanhGia}
														danhGia={traLoi}
														user={clerkUser}
														isTraLoi={true}
														refetch={async () => {
															await refetch();
														}}
													/>
												);
											})}
										</blockquote>
									</>
								)}
							</div>
						</>
					)}
				</div>
			</CardBody>
		</Card>
	);
};
