import { prisma } from "@/server/db/prisma";
import { type Prisma } from "@prisma/client";

import { NextResponse } from "next/server";

export async function POST(request: Request) {
	const payload = (await request.json()) as {
		danhMuc: string;
		data: {
			tenBanTin: string;
			noiDungTomGon: string;
			noiDung: string;
			previewImage: string;
		}[];
	};

	const danhMuc = await prisma.danhMuc.create({ data: { TenDanhMuc: payload.danhMuc } });
	const data: Prisma.BanTinCreateManyInput[] = payload.data.map((data) => {
		return {
			MaDanhMuc: danhMuc.MaDanhMuc,
			MaNhanVien: "test123213",

			TenBanTin: data.tenBanTin,
			NoiDung: data.noiDung,
			NoiDungTomTat: data.noiDungTomGon,
			PreviewImage: data.previewImage,
		} as Prisma.BanTinCreateManyInput;
	});

	await prisma.banTin.createMany({ data: data, skipDuplicates: true });

	return NextResponse.json({ success: true });
}
