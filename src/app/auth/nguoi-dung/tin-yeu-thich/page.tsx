import { BanTin } from "@/components/nguoi-dung/banTin";
import { api } from "@/utils/trpc/server";

import { BookMarked } from "lucide-react";

export default async function UserProfilePage() {
	const data = await api.user.getFavorites.query({ pageNum: 1, perPage: 6 });

	return (
		<BanTin initialFavorites={data}>
			<BookMarked size={30} /> Tin Yêu Thích
		</BanTin>
	);
}
