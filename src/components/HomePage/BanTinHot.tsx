"use client";

import NextLink from "next/link";

import { dayjs } from "@/utils/dayjs";
import { encodeBanTinPath } from "@/utils/path";
import { api } from "@/utils/trpc/react";
import { type getBanTinHot } from "./data";

import { Button, Card, CardFooter, Chip, Divider, Image, Link } from "@nextui-org/react";
import { Eye, Heart, MessagesSquare } from "lucide-react";

import toast from "react-hot-toast";

type ParamsType = {
	banTin: Awaited<ReturnType<typeof getBanTinHot>>[number];
};

export const BanTinHot = ({ banTin }: ParamsType) => {
	const banTinPath = encodeBanTinPath(banTin);

	const {
		data,
		isLoading,
		refetch: recheckYeuThich,
	} = api.banTin.checkYeuThich.useQuery(
		{ maBanTin: banTin.MaBanTin },
		{
			refetchOnReconnect: false,
			refetchOnWindowFocus: false,
		},
	);
	const yeuThich = api.banTin.yeuThich.useMutation({
		onSuccess: async () => await recheckYeuThich(),
		onError: ({ message }) => toast.error("Lỗi: " + message),
	});

	return (
		<div className="relative">
			<Chip classNames={{ base: "absolute left-2 top-2 z-20", content: "flex items-center gap-1" }}>
				<Eye size={20} /> {banTin.LuoiXem}
			</Chip>

			<Button
				isIconOnly
				size="sm"
				isLoading={isLoading || yeuThich.isLoading}
				startContent={
					isLoading || yeuThich.isLoading ? undefined : (
						<Heart size={20} className={data ? "fill-red-600 stroke-red-600" : undefined} />
					)
				}
				className="absolute right-2 top-2 z-20"
				onClick={() => {
					yeuThich.mutate({ maBanTin: banTin.MaBanTin });
				}}
			/>

			<Card as={"div"} isHoverable isPressable className="h-full shadow-[4px_4px_10px_1px_rgba(0,0,0,0.25)] shadow-default-200/60">
				<NextLink className="block aspect-video h-auto w-full" href={banTinPath}>
					<Image
						removeWrapper
						className="h-full w-full rounded-b-none object-cover"
						alt={banTin.NoiDungTomTat}
						src={banTin.PreviewImage}
					/>
				</NextLink>

				<CardFooter className="flex-col justify-between gap-2 border-t-1 border-zinc-100/50">
					<NextLink href={banTinPath} className="flex flex-col items-center gap-2">
						<h2 className="flex h-12 items-center text-center font-semibold">{banTin.TenBanTin}</h2>
						<p className="line-clamp-2">{banTin.NoiDungTomTat}</p>
					</NextLink>

					<Divider orientation="horizontal" />

					<Chip classNames={{ base: "max-w-full w-full", content: "grid w-full grid-cols-3 gap-3 place-items-center" }}>
						<Link underline="hover" as={NextLink} href={`/danhMuc/${banTin.DanhMuc.TenDanhMuc}`}>
							{banTin.DanhMuc.TenDanhMuc}
						</Link>

						<span>{dayjs(banTin.NgayDang).fromNow()}</span>

						<div className="flex gap-2">
							<MessagesSquare size={20} /> {banTin._count.DanhGia}
						</div>
					</Chip>
				</CardFooter>
			</Card>
		</div>
	);
};
