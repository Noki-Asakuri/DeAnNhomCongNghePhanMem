"use client";

import { Button, ButtonGroup, Link } from "@nextui-org/react";
import { AlertTriangle } from "lucide-react";

import type { Metadata } from "next";
import NextLink from "next/link";

export const metadata: Metadata = {
	title: "Lỗi 404 - Trang không tồn tại",
};

export default function NotFoundPage() {
	return (
		<div className="container mx-auto flex max-w-5xl flex-1 items-center justify-center">
			<div className="flex w-max flex-col items-center gap-2 px-2 py-4">
				<h1 className="flex items-center justify-center gap-2 text-5xl font-bold text-red-500">
					<AlertTriangle size={48} strokeWidth={1.5} /> Lỗi 404 <AlertTriangle size={48} strokeWidth={1.5} />
				</h1>

				<h2 className="text-2xl font-semibold text-red-500">Trang không tồn tại</h2>

				<p className="text-center text-lg">
					Trang mà bạn đang tìm không tồn tại. <br /> Vui lòng quay lại trang chính hoặc liên hệ chúng tôi nếu bạn nghĩ đây là 1
					lỗi kỹ thuật
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
}
