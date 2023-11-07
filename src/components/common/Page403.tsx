"use client";

import NextLink from "next/link";

import { Button, ButtonGroup, Link } from "@nextui-org/react";

import { AlertTriangle } from "lucide-react";

export const ForbiddenPage = () => {
	return (
		<div className="container mx-auto flex max-w-5xl flex-1 items-center justify-center">
			<div className="flex w-max flex-col items-center gap-2 px-2 py-4">
				<h1 className="flex items-center justify-center gap-2 text-5xl font-bold text-red-500">
					<AlertTriangle size={48} strokeWidth={1.5} /> Lỗi 403 <AlertTriangle size={48} strokeWidth={1.5} />
				</h1>

				<h2 className="text-2xl font-semibold text-red-500">Cấm truy cập!</h2>

				<p className="text-center text-lg">
					Quyền truy cập vào tài nguyên này trên máy chủ bị từ chối. <br />
					Trang này không thể hiển thị vì đã xảy ra lỗi máy chủ nội bộ. <br />
					Vui lòng liên hệ với quản trị viên website nếu bạn tin rằng bạn nên được cấp quyền truy cập.
				</p>

				<ButtonGroup>
					<Button as={NextLink} href="/" color="primary">
						Quay lại trang chủ
					</Button>

					<Button as={Link} isExternal href="mailto:phungtanphat23@gmail.com" color="secondary">
						Liên hệ kỹ thuật viên
					</Button>
				</ButtonGroup>
			</div>
		</div>
	);
};