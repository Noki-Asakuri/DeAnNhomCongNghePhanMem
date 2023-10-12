"use server";

import { prisma } from "@/server/db/prisma";
import { convertClerkUserIdToUUID } from "@/utils/clerk";

import { revalidatePath } from "next/cache";

type DanhGiaParams = {
	data: FormData;
	maBanTin: string;
	maNguoiDung?: string;
	url: string;
};

export const danhGiaBanTin = async ({ data, maBanTin, maNguoiDung, url }: DanhGiaParams) => {
	if (!maNguoiDung) throw new Error("Chưa Đăng Nhập");

	const noiDung = data.get("noiDungDanhGia")?.toString() || "";
	await prisma.danhGia.create({
		data: {
			NoiDung: noiDung,
			MaBanTin: maBanTin,
			MaNguoiDung: convertClerkUserIdToUUID(maNguoiDung),
		},
	});

	revalidatePath(url);
};

type TraLoiDanhGiaParams = {
	data: FormData;
	maBanTin: string;
	maNguoiDung?: string;
	maDanhGia: string;
	url: string;
};

export const traLoiDanhGia = async ({ data, maBanTin, maNguoiDung, maDanhGia, url }: TraLoiDanhGiaParams) => {
	if (!maNguoiDung) throw new Error("Chưa Đăng Nhập");

	const noiDung = data.get("noiDungDanhGia")?.toString() || "";
	await prisma.danhGia.create({
		data: {
			MaBanTin: maBanTin,
			MaTraLoi: maDanhGia,
			MaNguoiDung: convertClerkUserIdToUUID(maNguoiDung),
			NoiDung: noiDung,
		},
	});

	revalidatePath(url);
};
