"use client";

import type { layBanTin } from "@/app/bantin/[tenbanTin_maBanTin]/data";
import type { RouterOutput } from "@/server/trpc/trpc";
import type { User } from "@clerk/clerk-sdk-node";

import { dayjs } from "@/utils/dayjs";
import { trpc } from "@/utils/trpc/client";

import { Avatar, Button, Card, CardBody, Spacer, Spinner } from "@nextui-org/react";
import { Flag, MessagesSquare, Reply, ThumbsUp } from "lucide-react";
import toast from "react-hot-toast";

import { DanhGiaTextArea } from "./DanhGiaTextArea";
import { Fragment, useState } from "react";

type ParamsType = {
	banTin: NonNullable<Awaited<ReturnType<typeof layBanTin>>>;
	userJSON: string | null;
};

export const DanhGiaBanTin = ({ banTin, userJSON }: ParamsType) => {
	const user = userJSON ? (JSON.parse(userJSON) as User) : null;

	const {
		data,
		isLoading,
		isSuccess,
		refetch: refetchDanhGia,
	} = trpc.danhGia.getDanhGia.useQuery({ maBanTin: banTin.MaBanTin }, { refetchOnReconnect: false, refetchOnWindowFocus: false });

	if (isLoading) {
		return (
			<div className="flex items-center justify-center pt-4">
				<Spinner label="Loading..." color="primary" />
			</div>
		);
	}

	if (isSuccess && data.length === 0)
		return (
			<div className="flex flex-col gap-4 pt-4">
				<h3 className="text-2xl font-bold">Đánh Giá</h3>
				<div className="h-20 w-full">
					<div className="flex h-full items-center justify-center gap-5">
						<MessagesSquare strokeWidth={2} size={40} />
						<span className="text-xl">Hãy là người đầu tiên bình luận trong bài</span>
					</div>
				</div>

				{user && (
					<DanhGiaTextArea
						maBanTin={banTin.MaBanTin}
						user={user}
						refetch={async () => {
							await refetchDanhGia();
						}}
					/>
				)}
			</div>
		);

	return (
		<div className="flex flex-col gap-4 pt-4">
			{user && (
				<DanhGiaTextArea
					maBanTin={banTin.MaBanTin}
					user={user}
					refetch={async () => {
						await refetchDanhGia();
					}}
				/>
			)}

			<div className="flex flex-col gap-2">
				{isSuccess &&
					data.map((danhGia) => {
						return (
							<DanhGia
								key={danhGia.MaBanTin}
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
		</div>
	);
};

type DanhGiaParams = {
	danhGia: RouterOutput["danhGia"]["getDanhGia"][number];
	refetch: () => Promise<void>;
	user: User | null;
	isTraLoi: boolean;
};

const DanhGia = ({ danhGia, refetch, user, isTraLoi }: DanhGiaParams) => {
	const [isClicked, setClicked] = useState(false);
	const [isExpanded, setExpanded] = useState(false);

	const {
		data,
		isLoading,
		refetch: refetchLikes,
	} = trpc.danhGia.checkThichDanhGia.useQuery(
		{ maDanhGia: danhGia.MaDanhGia },
		{ refetchOnReconnect: false, refetchOnWindowFocus: false },
	);

	const thichDanhGia = trpc.danhGia.thichDanhGia.useMutation({
		onSuccess: async () => {
			await Promise.allSettled([refetchLikes(), refetch()]);
		},
		onError: ({ message }) => toast.error("Lỗi: " + message),
	});

	return (
		<Card as={isTraLoi ? Fragment : "div"}>
			<CardBody as={isTraLoi ? Fragment : "div"}>
				<div className="grid grid-cols-[max-content,1fr] gap-x-4">
					<Avatar size="lg" src={danhGia.NguoiDung.TaiKhoan.AnhDaiDien} className="row-[span_7_/_span_7]" />

					<div className="flex flex-col gap-1">
						<span> {danhGia.NguoiDung.TaiKhoan.TenTaiKhoan} </span>
						<p className="text-sm">{danhGia.NoiDung}</p>
					</div>

					<Spacer y={2} />

					<div className="flex items-center justify-between">
						<div className="flex items-center gap-2">
							<Button
								size="sm"
								variant="bordered"
								color={data ? "primary" : "default"}
								className="text-md"
								isLoading={isLoading || thichDanhGia.isLoading}
								startContent={
									isLoading || thichDanhGia.isLoading ? undefined : (
										<ThumbsUp size={16} className={data ? "fill-blue-600 stroke-blue-600" : undefined} />
									)
								}
								onClick={() => thichDanhGia.mutate({ maDanhGia: danhGia.MaDanhGia })}
							>
								{danhGia._count.DanhGiaLikes}
							</Button>

							{!isTraLoi && (
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

					{user && isClicked && (
						<>
							<Spacer y={2} />

							<div>
								<DanhGiaTextArea
									maBanTin={danhGia.MaBanTin}
									user={user}
									maTraLoi={danhGia.MaDanhGia}
									refetch={async () => {
										await refetch();
										setClicked(false);
									}}
								/>
							</div>
						</>
					)}

					{!isTraLoi && danhGia.TraLoiBoi.length > 0 && (
						<>
							<Spacer y={2} />

							<div>
								{!isExpanded && (
									<Button
										variant="light"
										size="sm"
										startContent={<Reply size={16} className="rotate-180" />}
										onClick={() => setExpanded(true)}
									>
										{danhGia.TraLoiBoi.length} trả lời
									</Button>
								)}

								{isExpanded && (
									<blockquote className="flex flex-col gap-4 border-l-2 border-default-500 pl-4">
										{danhGia.TraLoiBoi.map((traLoi) => {
											return (
												<DanhGia
													key={traLoi.MaBanTin}
													// @ts-expect-error TODO: Cho phép người dùng trả lời đánh giá trong 1 đánh giá khác
													danhGia={traLoi}
													user={user}
													isTraLoi={true}
													refetch={async () => {
														await refetch();
													}}
												/>
											);
										})}
									</blockquote>
								)}
							</div>
						</>
					)}
				</div>
			</CardBody>
		</Card>
	);
};
