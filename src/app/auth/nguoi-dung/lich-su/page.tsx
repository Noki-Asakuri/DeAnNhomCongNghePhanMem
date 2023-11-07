import { BanTin } from "@/components/nguoi-dung/banTin";
import { api } from "@/utils/trpc/server";

import { headers } from "next/headers";

import { History } from "lucide-react";

export default async function UserProfilePage() {
	const host = headers().get("host") as string;
	const data = await api.user.getHistoris.query({ pageNum: 1, perPage: 6 });

	return (
		<BanTin initialHistories={data} host={host}>
			<History size={30} /> Lịch sử xem
		</BanTin>
	);
}
