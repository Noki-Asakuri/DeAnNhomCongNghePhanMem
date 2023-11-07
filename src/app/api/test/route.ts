import { prisma } from "@/server/db/prisma";

import { NextResponse } from "next/server";

export const GET = async () => {
	await prisma.banTin.updateMany({ data: { TrangThai: "UNFINISHED" } });

	return NextResponse.json({ success: true });
};
