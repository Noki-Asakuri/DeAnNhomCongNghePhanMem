import { cache } from "react";

import { prisma } from "@/server/db/prisma";
import { decodeBanTinPath } from "@/utils/path";

export const layBanTin = cache(async (tenbanTin_maBanTin: string) => {
	const { maBanTin } = decodeBanTinPath(tenbanTin_maBanTin);

	const banTin = await prisma.banTin.findFirst({
		where: { MaBanTin: maBanTin },
		include: {
			DanhMuc: true,
			NhanVien: { include: { TaiKhoan: true } },
		},
	});

	return banTin;
});
