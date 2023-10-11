import { prisma } from "@/server/db/prisma";
import { type Prisma } from "@prisma/client";

import { NextResponse } from "next/server";

export async function POST(request: Request) {
	const payload = (await request.json()) as {
		tenBanTin: string;
		danhMuc: string;
		noiDungTomGon: string;
		noiDung: string;
		hinhNho: string;
	}[];

	const data = payload
		.map((item) => {
			return {
				MaDanhMuc: "9ef41fed-2ff5-4888-8d78-3522832f5cd0",
				MaNhanVien: "986a7e25-d157-42a0-8065-23dd1e281e67",
				NoiDung: item.noiDung,
				NoiDungTomTat: item.noiDungTomGon,
				PreviewImage: item.hinhNho,
				TenBanTin: item.tenBanTin,
			} satisfies Prisma.BanTinCreateManyArgs["data"];
		})
		.filter((item) => item.PreviewImage !== undefined);

	await prisma.banTin.createMany({ data, skipDuplicates: true });

	return NextResponse.json({ success: true });
}
