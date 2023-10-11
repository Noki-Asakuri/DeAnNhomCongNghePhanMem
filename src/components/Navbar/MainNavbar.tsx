"use client";

import type { User } from "@clerk/clerk-sdk-node";

import { SignOutButton } from "@clerk/nextjs";
import {
	Avatar,
	Badge,
	Button,
	Divider,
	Dropdown,
	DropdownItem,
	DropdownMenu,
	DropdownSection,
	DropdownTrigger,
	Navbar,
	NavbarBrand,
	NavbarContent,
} from "@nextui-org/react";

import { Bell, BookMarked, History, LogOut, User2, UserCog } from "lucide-react";
import Link from "next/link";

import { ThemeSwitcher } from "../theme-switcher";
import { RealTime } from "./Realtime";
import { SearchBar } from "./SearchBar";

const MainNavbar = ({ userJSON }: { userJSON: string | null }) => {
	const user = userJSON ? (JSON.parse(userJSON) as User) : null;

	return (
		<Navbar shouldHideOnScroll isBordered classNames={{ wrapper: "max-w-6xl" }}>
			<NavbarBrand className="flex h-8 items-center space-x-4 text-small">
				<h1 className="text-2xl font-bold text-inherit">
					<Link href="/">Bản Tin 24H</Link>
				</h1>
				<Divider orientation="vertical" />
				<RealTime />
			</NavbarBrand>

			<NavbarContent as="div" className="items-center" justify="end">
				<SearchBar />

				<ThemeSwitcher />

				{user && (
					<Badge isOneChar color="danger" shape="circle" placement="top-right">
						<Button radius="full" isIconOnly startContent={<Bell size={20} />} />
					</Badge>
				)}

				<Dropdown placement="bottom-end">
					<DropdownTrigger>
						<Avatar
							isBordered
							as="button"
							className="transition-transform"
							name={user ? user.username! : undefined}
							src={user ? user.imageUrl : undefined}
						/>
					</DropdownTrigger>

					{user && (
						<DropdownMenu aria-label="Profile Actions" variant="flat">
							<DropdownSection showDivider>
								<DropdownItem key="profile" className="h-14 gap-2">
									<p className="font-semibold">Đăng nhập bằng</p>
									<p className="font-semibold">{user.emailAddresses[0]?.emailAddress}</p>
								</DropdownItem>
							</DropdownSection>

							<DropdownSection title="Cài đặt" showDivider>
								<DropdownItem key="config" startContent={<User2 size={16} />}>
									<Link className="block w-full text-left" href="/auth/nguoi-dung/thong-tin-tai-khoan">
										Cài đặt tài khoản
									</Link>
								</DropdownItem>

								<DropdownItem key="config" startContent={<UserCog size={16} />}>
									<Link className="block w-full text-left" href="/auth/nguoi-dung/thong-tin-nguoi-dung">
										Cài đặt người dùng
									</Link>
								</DropdownItem>

								<DropdownItem key="bookmark" startContent={<BookMarked size={16} />}>
									<Link className="block w-full text-left" href="/auth/nguoi-dung/tin-da-luu">
										Tin Đã Lưu
									</Link>
								</DropdownItem>

								<DropdownItem key="history" startContent={<History size={16} />}>
									<Link className="block w-full text-left" href="/auth/nguoi-dung/tin-da-xem">
										Tin Đã Xem
									</Link>
								</DropdownItem>
							</DropdownSection>
							<DropdownSection title="Nguy hiểm">
								<DropdownItem key="logout" color="danger" startContent={<LogOut size={16} />}>
									<SignOutButton>
										<button className="w-full text-left">Đăng Xuất</button>
									</SignOutButton>
								</DropdownItem>
							</DropdownSection>
						</DropdownMenu>
					)}

					{!user && (
						<DropdownMenu aria-label="Login Actions" variant="flat">
							<DropdownItem key="login" color="primary">
								<Link href="/auth/dang-nhap" className="block w-full">
									Đăng nhập
								</Link>
							</DropdownItem>
						</DropdownMenu>
					)}
				</Dropdown>
			</NavbarContent>
		</Navbar>
	);
};

export { MainNavbar };
