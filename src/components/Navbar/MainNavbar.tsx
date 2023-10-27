"use client";

import { useClerk, useUser } from "@clerk/nextjs";
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

import { BookMarked, History, LogOut, User2, UserCog } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

import { ThemeSwitcher } from "../theme-switcher";
import { NotificationDropdown } from "./NotificationDropdown";
import { RealTime } from "./Realtime";
import { SearchBar } from "./SearchBar";

const MainNavbar = () => {
	const { isSignedIn, user, isLoaded } = useUser();
	const { signOut } = useClerk();

	const router = useRouter();
	const pathname = usePathname();

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

				{isLoaded && isSignedIn && <NotificationDropdown />}

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

					{isLoaded && isSignedIn && (
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
										onClick={() => {
											signOut()
												.then(() => router.refresh())
												.catch(() => router.refresh());
										}}
									>
										Đăng Xuất
									</button>
								</DropdownItem>
							</DropdownSection>
						</DropdownMenu>
					)}

					{(!isLoaded || !isSignedIn) && (
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
