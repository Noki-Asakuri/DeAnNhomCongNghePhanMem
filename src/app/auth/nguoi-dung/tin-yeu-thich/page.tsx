import { BanTin } from "@/components/nguoi-dung/banTin";
import { api } from "@/utils/trpc/server";

import { headers } from "next/headers";

import { BookMarked } from "lucide-react";

export default async function UserProfilePage() {
	const host = headers().get("host") as string;
	const data = await api.user.getFavorites.query({ pageNum: 1, perPage: 6 });

	return (
		<BanTin initialFavorites={data} host={host}>
			<BookMarked size={30} /> Tin Yêu Thích
		</BanTin>
	);
}
