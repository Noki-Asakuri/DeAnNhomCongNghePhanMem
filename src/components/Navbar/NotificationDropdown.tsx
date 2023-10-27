"use client";

import { api } from "@/utils/trpc/react";
import type { RouterOutputs } from "@/utils/trpc/shared";
import { dayjs } from "@/utils/dayjs";

import { Button, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from "@nextui-org/react";
import { Bell } from "lucide-react";

export const NotificationDropdown = () => {
	const notificationData = api.thongBao.getThongBao.useQuery();

	return (
		<Dropdown placement="bottom-end">
			<DropdownTrigger>
				{/* TODO: Not working if Badge wrap Button */}
				{/* <Badge isOneChar color="danger" shape="circle" placement="top-right" content={notificationData.data?.length}> */}
				<Button radius="full" isIconOnly startContent={<Bell size={20} />} />
				{/* </Badge> */}
			</DropdownTrigger>

			{notificationData.isSuccess && notificationData.data.length > 0 && (
				<DropdownMenu className="max-w-xs">
					{notificationData.data.map((thongBao) => {
						return (
							<DropdownItem key={thongBao.MaThongBao}>
								<Notification data={thongBao} />
							</DropdownItem>
						);
					})}
				</DropdownMenu>
			)}
		</Dropdown>
	);
};

const Notification = ({ data }: { data: RouterOutputs["thongBao"]["getThongBao"][number] }) => {
	return (
		<div className="flex flex-col gap-2">
			<div className="flex items-center justify-between">
				<span>{data.BanTin.DanhMuc.TenDanhMuc}</span>
				<span>{dayjs(data.CreateAt).fromNow()}</span>
			</div>

			<p className="whitespace-pre-wrap">{data.NoiDung}</p>
		</div>
	);
};
