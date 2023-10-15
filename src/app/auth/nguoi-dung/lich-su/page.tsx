import { BanTin } from "@/components/nguoi-dung/banTin";

import { currentUser } from "@clerk/nextjs";
import { History } from "lucide-react";

const layBanTinDaXem = async (maNguoiDung: string) => {
	return await prisma.banTinDaDoc.findMany({
		where: { MaNguoiDung: maNguoiDung },
	});
};

export default async function UserProfilePage() {
	const user = await currentUser();
	const data = await layBanTinDaXem(user!.id);

	return (
		<BanTin danhSachBanTin={data}>
			<History size={30} /> Lịch sử xem
		</BanTin>
	);
}
