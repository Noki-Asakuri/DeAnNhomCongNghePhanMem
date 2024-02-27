import { BanTin } from "@/components/nguoi-dung/banTin";
import { api } from "@/utils/trpc/server";

import { History } from "lucide-react";

export default async function UserProfilePage() {
	const data = await api.user.getHistoris.query({ pageNum: 1, perPage: 6 });

	return (
		<BanTin initialHistories={data}>
			<History size={30} /> Lịch sử xem
		</BanTin>
	);
}
