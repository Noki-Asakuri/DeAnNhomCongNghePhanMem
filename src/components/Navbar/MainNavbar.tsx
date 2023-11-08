"use client";

import { api } from "@/utils/trpc/react";

import { ThemeSwitcher } from "../theme-switcher";
import { NotificationDropdown } from "./NotificationDropdown";
import { SearchBar } from "./SearchBar";

import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { useClerk } from "@clerk/nextjs";
import {
	Avatar,
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

import { BookMarked, History, LogOut, Newspaper, User2, UserCog, Users } from "lucide-react";

const RealTime = dynamic(() => import("./Realtime").then((m) => m.RealTime), { ssr: false });

const MainNavbar = () => {
	const user = api.common.getUser.useQuery(undefined, { refetchOnMount: false, refetchOnWindowFocus: false });

	const { signOut } = useClerk();
	const pathname = usePathname();

	return (
		<Navbar shouldHideOnScroll isBordered classNames={{ wrapper: "max-w-6xl" }}>
			<NavbarBrand className="flex h-8 items-center space-x-4 text-small">
				<Link href="/" className="flex items-center justify-center gap-1">
					<Image alt="Bản tin 24H icon" src={"/favicon.png"} width={32} height={32} />
					<h1 className="text-2xl font-bold text-inherit">Bản Tin 24H</h1>
				</Link>
				<Divider orientation="vertical" />

				<RealTime />
			</NavbarBrand>

			<NavbarContent as="div" className="items-center" justify="end">
				<SearchBar />

				<ThemeSwitcher />

				{user.isSuccess && user.data && <NotificationDropdown />}

				<Dropdown placement="bottom-end">
					<DropdownTrigger>
						<Avatar
							isBordered
							showFallback
							as="button"
							className="transition-transform"
							name={user.data?.TenTaiKhoan ?? undefined}
							src={user.data?.AnhDaiDien}
						/>
					</DropdownTrigger>

					{user.isSuccess && user.data && (
						<DropdownMenu aria-label="Profile Actions" variant="flat" closeOnSelect={false}>
							<DropdownSection showDivider>
								<DropdownItem key="profile" className="h-14 gap-2">
									<p className="font-semibold">Đăng nhập bằng</p>
									<p className="font-semibold">{user.data?.Email}</p>
								</DropdownItem>
							</DropdownSection>

							{["QuanTriVien", "TongBienTap", "NhanVien"].includes(user.data.VaiTro) ? (
								<DropdownSection title="Quản Lý" showDivider>
									<DropdownItem key="newsManage" startContent={<Newspaper size={16} />}>
										<Link className="block w-full text-left" href="/admin/manage/news">
											Quản lý bản tin
										</Link>
									</DropdownItem>

									{user.data.VaiTro !== "NhanVien" ? (
										<DropdownItem key="userManage" startContent={<Users size={16} />}>
											<Link className="block w-full text-left" href="/admin/manage/users">
												Quản lý người dùng
											</Link>
										</DropdownItem>
									) : (
										// eslint-disable-next-line @typescript-eslint/no-explicit-any
										(undefined as any)
									)}
								</DropdownSection>
							) : (
								// eslint-disable-next-line @typescript-eslint/no-explicit-any
								(undefined as any)
							)}

							<DropdownSection title="Cài đặt" showDivider>
								<DropdownItem key="accountSettings" startContent={<User2 size={16} />}>
									<Link className="block w-full text-left" href="/auth/nguoi-dung/thong-tin-tai-khoan">
										Cài đặt tài khoản
									</Link>
								</DropdownItem>

								<DropdownItem key="userSettings" startContent={<UserCog size={16} />}>
									<Link className="block w-full text-left" href="/auth/nguoi-dung/thong-tin-nguoi-dung">
										Cài đặt người dùng
									</Link>
								</DropdownItem>

								<DropdownItem key="favorite" startContent={<BookMarked size={16} />}>
									<Link className="block w-full text-left" href="/auth/nguoi-dung/tin-yeu-thich">
										Tin yêu thích
									</Link>
								</DropdownItem>

								<DropdownItem key="history" startContent={<History size={16} />}>
									<Link className="block w-full text-left" href="/auth/nguoi-dung/lich-su">
										Lịch sử xem
									</Link>
								</DropdownItem>
							</DropdownSection>
							<DropdownSection title="Nguy hiểm">
								<DropdownItem key="logout" color="danger" startContent={<LogOut size={16} />}>
									<button
										className="w-full text-left"
										// eslint-disable-next-line @typescript-eslint/no-misused-promises
										onClick={async () => await signOut().then(() => user.refetch())}
									>
										Đăng xuất
									</button>
								</DropdownItem>
							</DropdownSection>
						</DropdownMenu>
					)}

					{(user.isLoading || !user.data) && (
						<DropdownMenu aria-label="Login Actions" variant="flat">
							<DropdownItem key="login" color="primary">
								<Link href={{ pathname: "/auth/dang-nhap", query: { redirect_url: pathname } }} className="block w-full">
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
