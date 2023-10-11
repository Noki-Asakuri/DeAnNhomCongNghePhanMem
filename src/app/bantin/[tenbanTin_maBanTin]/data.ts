import { cache } from "react";

import { prisma } from "@/server/db/prisma";
import { convertClerkUserIdToUUID } from "@/utils/clerk";
import { decodeBanTinPath } from "@/utils/path";

export const layBanTin = cache(async (tenbanTin_maBanTin: string) => {
	const [, maBanTin] = decodeBanTinPath(tenbanTin_maBanTin);

	const banTin = await prisma.banTin.findFirst({
		where: { MaBanTin: maBanTin },
		include: {
			DanhGia: {
				select: {
					NguoiDung: true,
					TraLoiBoi: { orderBy: { NgayDanhGia: "desc" }, select: { NguoiDung: true } },
				},
			},
			DanhMuc: true,
			NhanVien: true,
		},
	});

	return banTin;
});

export const layBanTinXemNhieu = async (tenbanTin_maBanTin: string) => {
	const [, maBanTin] = decodeBanTinPath(tenbanTin_maBanTin);

	const banTinXemNhieu = await prisma.banTin.findMany({
		where: { NOT: { MaBanTin: maBanTin } },
		include: { DanhGia: true },
		orderBy: { luoiXem: "desc" },
		take: 3,
	});

	return banTinXemNhieu;
};

export const checkDaLuuBanTin = async (tenbanTin_maBanTin: string, maNguoiDung?: string) => {
	if (!maNguoiDung) return false;
	const [, maBanTin] = decodeBanTinPath(tenbanTin_maBanTin);

	const data = await prisma.banTinDaLuu.findFirst({
		where: {
			MaNguoiDung: convertClerkUserIdToUUID(maNguoiDung),
			MaBanTin: maBanTin,
		},
	});
	return data !== null;
};
