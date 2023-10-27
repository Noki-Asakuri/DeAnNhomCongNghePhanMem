import "@/styles/globals.css";

import React from "react";

import { viVN } from "@clerk/localizations";
import { ClerkProvider } from "@clerk/nextjs";

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";

import { MainNavbar } from "@/components/Navbar/MainNavbar";
import { Toaster } from "@/components/Toaster";
import { BottomFooter } from "@/components/layout/BottomFooter";
import { MainLayout } from "@/components/layout/MainLayout";
import { headers } from "next/headers";

const font = Inter({ subsets: ["latin"], display: "swap", weight: "400" });

export const metadata: Metadata = {
	title: "Bản Tin 24H - Nguồn Tin Tức Đa Dạng và Chính Xác",
	description:
		"Bản Tin 24H là trang web tin tức mới nhất với nội dung đa dạng và phong phú về các sự kiện, tin tức xã hội, kinh doanh, công nghệ và nhiều lĩnh vực khác. Cung cấp thông tin tin tức chính xác, đáng tin cậy và nhanh chóng, Bản Tin 24H giúp bạn cập nhật những tin tức mới nhất trong và ngoài nước. Hãy khám phá và trải nghiệm ngay để không bỏ lỡ bất kỳ tin tức quan trọng nào.",
	authors: { name: "Asakuri", url: "https://github.com/Noki-Asakuri" },
	keywords: ["Bản Tin 24H", "tin tức", "sự kiện", "xã hội", "kinh doanh", "công nghệ", "nội dung đa dạng"],
	viewport: { initialScale: 1, maximumScale: 1 },
	icons: "/favicon.png",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
	const header = headers();

	return (
		<ClerkProvider localization={viVN}>
			<html lang="en">
				<head />
				<body className={font.className}>
					<MainLayout headers={header}>
						<MainNavbar />
						<main className="flex h-full max-h-max max-w-full flex-1 flex-col overflow-hidden">{children}</main>
						<BottomFooter />
					</MainLayout>

					<Toaster />
					<Analytics />
				</body>
			</html>
		</ClerkProvider>
	);
}
