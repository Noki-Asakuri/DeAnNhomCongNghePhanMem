import { NewsTable } from "@/components/admin/news/NewsTable";
import { ForbiddenPage } from "@/components/common/Page403";
import { api } from "@/utils/trpc/server";

import type { Metadata } from "next";

import { cache } from "react";

const getUser = cache(async () => {
	return await api.admin.getCurrentUser.query({ allowedRoles: ["QuanTriVien", "TongBienTap", "NhanVien"] });
});

export const generateMetadata = async (): Promise<Metadata> => {
	const user = await getUser();

	if (!user) return { title: "Lỗi 403 - Cấm truy cập" };
	return { title: "Quản lý bản tin - Trang Admin" };
};

export default async function Page() {
	const user = await getUser();
	if (!user) return <ForbiddenPage />;

	const [newsData, categories, nhanVien] = await Promise.all([
		api.admin.getNews.query({ pageNum: 1, perPage: 6 }),
		api.common.getCategories.query(),
		user.VaiTro !== "NhanVien" && api.admin.getUsers.query({ query: { queryRoles: ["NhanVien"] } }),
	]);

	return (
		<section className="flex w-full flex-col gap-2">
			<NewsTable initialNews={newsData} initialCategories={categories} user={user} staff={nhanVien || undefined} />
		</section>
	);
}
