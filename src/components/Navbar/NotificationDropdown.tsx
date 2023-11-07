"use client";

import { dayjs } from "@/utils/dayjs";
import { api } from "@/utils/trpc/react";
import type { RouterOutputs } from "@/utils/trpc/shared";

import { Badge, Button, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from "@nextui-org/react";

import { Bell } from "lucide-react";

export const NotificationDropdown = () => {
	const notificationData = api.user.getNotifications.useQuery(undefined, { refetchOnWindowFocus: false, refetchOnReconnect: false });

	return (
		<Dropdown placement="bottom-end">
			<Badge
				isInvisible={!notificationData.isSuccess || notificationData.data.length === 0}
				disableOutline
				color="danger"
				shape="circle"
				placement="top-right"
				content={notificationData.data?.length}
			>
				<DropdownTrigger>
					<Button radius="full" isIconOnly startContent={<Bell size={20} />} />
				</DropdownTrigger>
			</Badge>

			{notificationData.isSuccess && notificationData.data.length > 0 && (
				<DropdownMenu className="max-w-xs" closeOnSelect={false}>
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

const Notification = ({ data }: { data: RouterOutputs["user"]["getNotifications"][number] }) => {
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
