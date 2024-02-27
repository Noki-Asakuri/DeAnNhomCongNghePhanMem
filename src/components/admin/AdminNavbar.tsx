"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

import { Button, Tab, Tabs } from "@nextui-org/react";

import { ChevronLeft, Newspaper, Users } from "lucide-react";

export const AdminNavbar = () => {
	const pathName = usePathname();
	const router = useRouter();

	return (
		<aside className="flex w-full items-center gap-2">
			<Button isIconOnly startContent={<ChevronLeft />} onPress={() => router.back()} variant="bordered" />

			<Tabs
				variant="bordered"
				color="primary"
				classNames={{ base: "w-full", tabList: "w-full" }}
				selectedKey={pathName.slice("/admin/manage/".length).split("/").at(0)}
			>
				<Tab
					as={Link}
					key={"users"}
					href="/admin/manage/users"
					title={
						<div className="flex items-center space-x-2">
							<Users />
							<span>Quản lý người dùng</span>
						</div>
					}
				/>
				<Tab
					as={Link}
					href="/admin/manage/news"
					key={"news"}
					title={
						<div className="flex items-center space-x-2">
							<Newspaper />
							<span>Quản lý bản tin</span>
						</div>
					}
				/>
			</Tabs>
		</aside>
	);
};
