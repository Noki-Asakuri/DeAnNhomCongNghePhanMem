"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

import { SignOutButton } from "@clerk/nextjs";
import { Button, Card, Divider } from "@nextui-org/react";

import type { ReactNode } from "react";

export const NguoiDungSideBar = () => {
	const currentPath = usePathname();
	const router = useRouter();

	return (
		<Card className="h-max w-1/5 flex-col items-center justify-start gap-2 p-2">
			<TabItem currentPath={currentPath} href={"/auth/nguoi-dung/thong-tin-tai-khoan"}>
				Thông tin Tài Khoản
			</TabItem>

			<TabItem currentPath={currentPath} href={"/auth/nguoi-dung/thong-tin-nguoi-dung"}>
				Thông tin Người Dùng
			</TabItem>

			<TabItem currentPath={currentPath} href={"/auth/nguoi-dung/tin-da-luu"}>
				Tin đã lưu
			</TabItem>

			<TabItem currentPath={currentPath} href={"/auth/nguoi-dung/tin-da-xem"}>
				Tin đã xem
			</TabItem>

			<SignOutButton signOutCallback={() => router.refresh()}>
				<Button color="danger" className="w-full" variant="light">
					Đăng xuất
				</Button>
			</SignOutButton>

			<Divider orientation="horizontal" />

			<div className="h-full w-full text-center text-sm">
				<span className="block">Cần hỗ trợ? Vui lòng liên hệ: </span>

				<a href="mailto:phungtanphat23@gmail.com" className="text-blue-600">
					phungtanphat23@gmail.com
				</a>
			</div>
		</Card>
	);
};

const TabItem = ({ href, currentPath, children }: { href: string; currentPath: string; children: ReactNode }) => {
	const isActive = currentPath == href;

	return (
		<Button as={Link} href={href} className="w-full" variant={isActive ? "solid" : "light"}>
			{children}
		</Button>
	);
};
