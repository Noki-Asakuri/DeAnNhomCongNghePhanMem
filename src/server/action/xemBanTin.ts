"use server";

import { prisma } from "@/server/db/prisma";
import { convertClerkUserIdToUUID } from "@/utils/clerk";

type XemBanTinParams = {
	maBanTin: string;
	maNguoiDung?: string;
};

export const danhDauDaXemBanTin = async ({ maBanTin, maNguoiDung }: XemBanTinParams) => {
	if (!maNguoiDung) throw new Error("Chưa Đăng Nhập");

	await prisma.banTinDaLuu.create({
		data: { MaBanTin: maBanTin, MaNguoiDung: convertClerkUserIdToUUID(maNguoiDung) },
	});

	await prisma.banTin.update({
		data: { luoiXem: { increment: 1 } },
		where: { MaBanTin: maBanTin },
	});
};
