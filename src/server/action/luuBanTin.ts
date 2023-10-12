"use server";

import { prisma } from "@/server/db/prisma";
import { convertClerkUserIdToUUID } from "@/utils/clerk";

export const luuBanTin = async ({ maBanTin, maNguoiDung }: { maBanTin: string; maNguoiDung?: string }) => {
	if (!maNguoiDung) throw new Error("Chưa Đăng Nhập");

	await prisma.banTinDaLuu.create({
		data: { MaBanTin: maBanTin, MaNguoiDung: convertClerkUserIdToUUID(maNguoiDung) },
	});
};
