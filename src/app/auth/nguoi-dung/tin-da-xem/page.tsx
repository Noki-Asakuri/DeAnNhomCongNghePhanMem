import { BanTin } from "@/components/nguoi-dung/banTin";

import { currentUser } from "@clerk/nextjs";
import { History } from "lucide-react";

const layBanTinDaXem = async (maNguoiDung: string) => {
	return await prisma.banTinDaLuu.findMany({
		where: { MaNguoiDung: maNguoiDung },
	});
};

export default async function UserProfilePage() {
	const user = await currentUser();
	const data = await layBanTinDaXem(user!.id);

	return (
		<BanTin danhSachBanTin={data}>
			<History size={30} /> Bản Tin Đã Xem
		</BanTin>
	);
}
