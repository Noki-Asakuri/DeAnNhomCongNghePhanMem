import { UserTable } from "@/components/admin/user/UserTable";
import { ForbiddenPage } from "@/components/common/Page403";
import { api } from "@/utils/trpc/server";

import type { Metadata } from "next";

import { cache } from "react";

const getUser = cache(async () => {
	return await api.admin.getCurrentUser.query({ allowedRoles: ["QuanTriVien", "TongBienTap"] });
});

export const generateMetadata = async (): Promise<Metadata> => {
	const user = await getUser();

	if (!user) return { title: "Lỗi 403 - Cấm truy cập" };
	return { title: "Quản lý người dùng - Trang Admin" };
};

export default async function Page() {
	const user = await getUser();
	if (!user) return <ForbiddenPage />;

	const usersData = await api.admin.getUsers.query({ pageNum: 1, perPage: 6 });

	return (
		<section className="flex w-full flex-col gap-2">
			<UserTable initialUsers={usersData} currentUser={user} />
		</section>
	);
}
