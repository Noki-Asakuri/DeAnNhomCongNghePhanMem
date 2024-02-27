import { ForbiddenPage } from "@/components/common/Page403";
import { api } from "@/utils/trpc/server";

import dymamic from "next/dynamic";

import { Spinner } from "@nextui-org/react";

const PreviewNews = dymamic(() => import("@/components/admin/news/create/PreviewNews"), {
	ssr: false,
	loading: () => <Spinner label="Đang tải..." />,
});

export default async function PreviewNewsPage() {
	const user = await api.admin.getCurrentUser.query({ allowedRoles: ["NhanVien", "QuanTriVien", "TongBienTap"] });
	if (!user) return <ForbiddenPage />;

	const categories = await api.common.getCategories.query();

	return (
		<main className="flex w-full flex-col gap-4">
			<PreviewNews categories={categories} user={user} />
		</main>
	);
}
