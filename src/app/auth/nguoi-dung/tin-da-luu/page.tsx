import { BanTin } from "@/components/nguoi-dung/banTin";
import { prisma } from "@/server/db/prisma";

import { currentUser } from "@clerk/nextjs";
import { BookMarked } from "lucide-react";

const layBanTinYeuThich = async (maNguoiDung: string) => {
	return await prisma.banTinYeuThich.findMany({
		where: { MaNguoiDung: maNguoiDung },
	});
};

export default async function UserProfilePage() {
	const user = await currentUser();
	const data = await layBanTinYeuThich(user!.id);

	return (
		<BanTin danhSachBanTin={data}>
			<BookMarked size={30} /> Bản Tin Yêu Thích
		</BanTin>
	);
}
