"use client";

import { getUrl } from "@/utils/path";
import { Button, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, Link } from "@nextui-org/react";
import { Copy, Heart, MoreHorizontal, Twitter } from "lucide-react";

import { toast } from "react-hot-toast";

export const ChiaSeDropdown = ({ duongDanBanTin, tenBanTin, host }: { duongDanBanTin: string; tenBanTin: string; host: string }) => {
	const tweetUrl = new URL("https://twitter.com/intent/tweet");

	tweetUrl.searchParams.set("text", tenBanTin);
	tweetUrl.searchParams.set("url", getUrl(host, duongDanBanTin));

	return (
		<div className="flex items-center justify-end gap-2">
			<Button isIconOnly radius="full" variant="light" startContent={<Heart size={20} />} />

			<Dropdown placement="bottom-end">
				<DropdownTrigger>
					<Button variant="light" radius="full" isIconOnly startContent={<MoreHorizontal size={20} />} />
				</DropdownTrigger>

				<DropdownMenu aria-label="Share Actions" variant="flat">
					<DropdownItem className="p-0">
						<Button
							variant="light"
							startContent={<Copy size={16} />}
							className="w-full"
							onClick={() => {
								const handler = async () => {
									await window.navigator.clipboard.writeText(duongDanBanTin);
									toast.success("Copy đường dẫn thành công!");
								};
								handler().catch(() => {});
							}}
						>
							Copy đường dẫn
						</Button>
					</DropdownItem>

					<DropdownItem className="p-0">
						<Button
							as={Link}
							isExternal
							showAnchorIcon
							href={tweetUrl.toString()}
							variant="light"
							className="w-full"
							startContent={<Twitter size={16} />}
						>
							Chia sẽ với X
						</Button>
					</DropdownItem>
				</DropdownMenu>
			</Dropdown>
		</div>
	);
};
