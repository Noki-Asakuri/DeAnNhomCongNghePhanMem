"use client";

import { getUrl } from "@/utils/path";
import { api } from "@/utils/trpc/react";

import { Button, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, Link } from "@nextui-org/react";

import { Copy, Heart, MoreHorizontal, Twitter } from "lucide-react";
import { toast } from "react-hot-toast";

type PropsParms = { duongDanBanTin: string; tenBanTin: string; host: string; maBanTin: string; refetch?: () => Promise<unknown> };

export const ChiaSeDropdown = ({ duongDanBanTin, tenBanTin, maBanTin, host, refetch }: PropsParms) => {
	const tweetUrl = new URL("https://twitter.com/intent/tweet");

	tweetUrl.searchParams.set("text", tenBanTin);
	tweetUrl.searchParams.set("url", getUrl(host, duongDanBanTin));

	const {
		data,
		isLoading,
		refetch: recheckYeuThich,
	} = api.banTin.checkYeuThich.useQuery({ maBanTin: maBanTin }, { refetchOnReconnect: false, refetchOnWindowFocus: false });

	const yeuThich = api.banTin.yeuThich.useMutation({
		onSuccess: async () => await Promise.all([recheckYeuThich(), refetch ? refetch() : undefined]),
		onError: ({ message }) => toast.error("Lỗi: " + message),
	});

	return (
		<div className="flex items-center justify-end gap-2">
			<Button
				isLoading={isLoading || yeuThich.isLoading}
				isIconOnly
				radius="full"
				variant="light"
				startContent={
					isLoading || yeuThich.isLoading ? undefined : (
						<Heart size={20} className={data ? "fill-red-600 stroke-red-600" : undefined} />
					)
				}
				onPress={() => yeuThich.mutate({ maBanTin: maBanTin })}
			/>

			<Dropdown showArrow>
				<DropdownTrigger>
					<Button variant="light" radius="full" isIconOnly startContent={<MoreHorizontal size={20} />} />
				</DropdownTrigger>

				<DropdownMenu aria-label="Share Actions" variant="flat">
					<DropdownItem startContent={<Copy size={16} />}>
						<Button
							size="sm"
							variant="light"
							className="w-full justify-start p-0 data-[hover=true]:bg-transparent"
							onPress={() => {
								const handler = async () => {
									await window.navigator.clipboard.writeText(getUrl(host, duongDanBanTin, true));
									toast.success("Copy đường dẫn thành công!");
								};
								handler().catch(() => {});
							}}
						>
							Copy đường dẫn
						</Button>
					</DropdownItem>

					<DropdownItem startContent={<Twitter size={16} />}>
						<Button
							size="sm"
							as={Link}
							isExternal
							showAnchorIcon
							href={tweetUrl.toString()}
							variant="light"
							className="w-full justify-start p-0 data-[hover=true]:bg-transparent"
						>
							Chia sẽ với X
						</Button>
					</DropdownItem>
				</DropdownMenu>
			</Dropdown>
		</div>
	);
};
