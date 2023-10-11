import { prisma } from "@/server/db/prisma";

export const getBanTinHot = async () => {
	const data = await prisma.banTin.findMany({
		include: { DanhGia: { select: { _count: true } }, DanhMuc: { select: { TenDanhMuc: true } } },
		orderBy: { luoiXem: "desc" },
		take: 3,
	});
	return data;
};

export const getRandomBanTin = async () => {
	// TODO: randomize this
	const data = await prisma.banTin.findMany({
		include: { DanhGia: { select: { _count: true } }, DanhMuc: { select: { TenDanhMuc: true } } },
		take: 5,
	});

	return data;
};

export const getDanhMuc = async () => {
	const data = await prisma.danhMuc.findMany({
		include: { BanTin: { take: 3, include: { DanhGia: true } } },
		take: 3,
	});

	return data;
};
