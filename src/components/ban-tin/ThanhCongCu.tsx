"use client";

import type { layBanTin } from "@/app/bantin/[tenbanTin_maBanTin]/data";
import { getUrl } from "@/utils/path";
import { api } from "@/utils/trpc/react";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { Button, ButtonGroup } from "@nextui-org/react";

import { ArrowLeft, Heart, Link as LinkIcon, Twitter } from "lucide-react";
import { toast } from "react-hot-toast";

type ParamsType = {
	banTin: Awaited<ReturnType<typeof layBanTin>>;
};

export const ThanhCongCu = ({ banTin }: ParamsType) => {
	const {
		data,
		isLoading,
		refetch: recheckYeuThich,
	} = api.banTin.checkYeuThich.useQuery(
		{ maBanTin: banTin!.MaBanTin },
		{
			refetchOnReconnect: false,
			refetchOnWindowFocus: false,
		},
	);
	const yeuThich = api.banTin.yeuThich.useMutation({
		onSuccess: async () => await recheckYeuThich(),
		onError: ({ message }) => toast.error("Lỗi: " + message),
	});

	const tweetUrl = new URL("https://twitter.com/intent/tweet");
	const currentPath = usePathname();

	tweetUrl.searchParams.set("text", banTin!.TenBanTin);
	tweetUrl.searchParams.set("url", getUrl(currentPath));

	return (
		<div className="flex items-center justify-between pt-4">
			<div className="flex gap-4">
				<Button variant="ghost" isIconOnly as={Link} startContent={<ArrowLeft />} href={`/danhMuc/${banTin!.DanhMuc.TenDanhMuc}`} />

				<Button
					isIconOnly
					variant="ghost"
					isLoading={isLoading || yeuThich.isLoading}
					startContent={
						isLoading || yeuThich.isLoading ? undefined : (
							<Heart size={20} className={data ? "fill-red-600 stroke-red-600" : undefined} />
						)
					}
					onPress={() => yeuThich.mutate({ maBanTin: banTin!.MaBanTin })}
				/>
			</div>

			<div className="flex items-center gap-2">
				<span> Chia sẽ:</span>

				<ButtonGroup>
					<Button
						isIconOnly
						as={Link}
						color="primary"
						variant="ghost"
						href={tweetUrl.toString()}
						target="_blank"
						title="Chia sẽ bản tin này lên X"
						startContent={<Twitter size={20} />}
					/>

					<Button
						isIconOnly
						variant="ghost"
						color="success"
						title="Sao chép đường dẫn của bản tin này"
						startContent={<LinkIcon size={20} />}
						onClick={() => {
							window.navigator.clipboard
								.writeText(getUrl(currentPath))
								.then(() => {
									toast.success("Sao chép đường đẫn thành công");
								})
								.catch(() => {
									toast.error("Sao chép đường đẫn thất bại");
								});
						}}
					/>
				</ButtonGroup>
			</div>
		</div>
	);
};
