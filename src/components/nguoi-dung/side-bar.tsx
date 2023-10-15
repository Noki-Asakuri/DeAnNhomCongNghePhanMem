"use client";

import { useClerk } from "@clerk/nextjs";

import { Button, Card, Divider, Popover, PopoverContent, PopoverTrigger, type PropsOf } from "@nextui-org/react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

import { BookMarked, History, LogOut, User2, UserCog } from "lucide-react";
import { useTransition } from "react";

export const NguoiDungSideBar = () => {
	const [isLoading, startTransition] = useTransition();
	const { signOut } = useClerk();

	const currentPath = usePathname();
	const router = useRouter();

	return (
		<Card className="h-max w-1/5 flex-col items-center justify-start gap-2 p-2">
			<TabItem currentPath={currentPath} href={"/auth/nguoi-dung/thong-tin-tai-khoan"} startContent={<User2 size={16} />}>
				Thông tin Tài Khoản
			</TabItem>

			<TabItem currentPath={currentPath} href={"/auth/nguoi-dung/thong-tin-nguoi-dung"} startContent={<UserCog size={16} />}>
				Thông tin Người Dùng
			</TabItem>

			<TabItem currentPath={currentPath} href={"/auth/nguoi-dung/tin-yeu-thich"} startContent={<BookMarked size={16} />}>
				Tin yêu thích
			</TabItem>

			<TabItem currentPath={currentPath} href={"/auth/nguoi-dung/lich-su"} startContent={<History size={16} />}>
				Lịch sử xem
			</TabItem>

			<Popover placement="right" showArrow>
				<PopoverTrigger>
					<Button color="danger" className="w-full justify-start" variant="light" startContent={<LogOut size={16} />}>
						Đăng xuất
					</Button>
				</PopoverTrigger>
				<PopoverContent>
					<div className="flex flex-col gap-2 px-1 py-2">
						<div className="text-small font-bold">Bạn có chắc chắn?</div>
						<div className="text-tiny">
							<Button
								isLoading={isLoading}
								color="danger"
								variant="light"
								size="sm"
								className="w-full"
								onClick={() => {
									startTransition(async () => {
										await signOut();
									});

									router.refresh();
								}}
							>
								Đăng xuất
							</Button>
						</div>
					</div>
				</PopoverContent>
			</Popover>

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

const TabItem = (props: PropsOf<typeof Button> & { currentPath: string }) => {
	const isActive = props.currentPath == props.href;

	return (
		<Button {...props} as={Link} className="w-full justify-start" variant={isActive ? "solid" : "light"}>
			{props.children}
		</Button>
	);
};
