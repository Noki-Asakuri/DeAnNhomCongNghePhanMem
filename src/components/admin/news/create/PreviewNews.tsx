"use client";

import { NoiDung } from "@/app/bantin/[tenbanTin_maBanTin]/noiDung";
import { newStores } from "@/server/db/store";
import { dayjs } from "@/utils/dayjs";
import { api } from "@/utils/trpc/react";
import type { RouterOutputs } from "@/utils/trpc/shared";

import NextLink from "next/link";

import { Button, Card, CardFooter, Chip, Divider, Image, Link } from "@nextui-org/react";

import { AlertTriangle, MessagesSquare } from "lucide-react";
import toast from "react-hot-toast";
import { useStore } from "zustand";

const PreviewNews = ({
	categories,
	user,
}: {
	categories: RouterOutputs["common"]["getCategories"];
	user: NonNullable<RouterOutputs["admin"]["getCurrentUser"]>;
}) => {
	const state = useStore(newStores, (state) => state);

	const now = Date.now();
	const category = categories.find(({ MaDanhMuc }) => MaDanhMuc === state.MaDanhMuc);

	const dateFormatter = new Intl.DateTimeFormat("vi", { dateStyle: "full" });
	const timeFormatter = new Intl.DateTimeFormat("vi", { timeStyle: "long" });

	const createNews = api.admin.createNews.useMutation({
		onError: ({ message }) => toast.error("Lỗi: " + message),
	});

	return (
		<div className="space-y-4 py-4">
			<Button fullWidth color="warning" isDisabled startContent={<AlertTriangle />}>
				Đang trong chế độ xem thử
			</Button>

			<div className="flex gap-4">
				<section className="w-2/3">
					<div className="flex items-center justify-between">
						<Link as={NextLink} href={`/danhMuc/${category?.TenDanhMuc}`} underline="hover">
							{category?.TenDanhMuc}
						</Link>

						<div className="pr-4">
							{dateFormatter.format(now)}, lúc {timeFormatter.format(now)}
						</div>
					</div>

					<div className="rounded-br-lg border-b-[1px] border-r-[1px] border-[#262626]/60 pr-4">
						<h1 className="py-5 text-3xl font-bold"> {state.TenBanTin} </h1>

						<NoiDung>{state.NoiDung}</NoiDung>
					</div>

					<div className="flex items-center justify-end pr-4 pt-5">
						<span className="text-xl font-bold">{user?.TenTaiKhoan}</span>
					</div>
				</section>

				<section className="h-max w-1/3">
					<h4 className="pb-3 text-xl font-bold"> Hiển thị trang chính</h4>

					<Card
						as={"div"}
						isHoverable
						isPressable
						className="h-full shadow-[4px_4px_10px_1px_rgba(0,0,0,0.25)] shadow-default-200/60"
					>
						<div className="block aspect-video h-auto w-full">
							<Image
								removeWrapper
								className="h-full w-full rounded-b-none object-cover"
								alt={state.NoiDungTomTat}
								src={state.PreviewImage}
							/>
						</div>

						<CardFooter className="flex-col justify-between gap-2 border-t-1 border-zinc-100/50">
							<div className="flex flex-col items-center gap-2">
								<h2 className="flex h-12 items-center text-center font-semibold">{state.TenBanTin}</h2>
								<p className="line-clamp-2">{state.NoiDungTomTat}</p>
							</div>

							<Divider orientation="horizontal" />

							<Chip classNames={{ base: "max-w-full w-full", content: "grid w-full grid-cols-3 gap-3 place-items-center" }}>
								<Link underline="hover" as={NextLink} href={`/danhMuc/${category?.TenDanhMuc}`}>
									{category?.TenDanhMuc}
								</Link>

								<span>{dayjs(now).fromNow()}</span>

								<div className="flex gap-2">
									<MessagesSquare size={20} /> 0
								</div>
							</Chip>
						</CardFooter>
					</Card>
				</section>
			</div>

			<Button fullWidth color="success" onPress={() => createNews.mutate(state)} isLoading={createNews.isLoading}>
				Thêm bản tin
			</Button>
		</div>
	);
};

export default PreviewNews;
