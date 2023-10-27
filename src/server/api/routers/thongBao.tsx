import z from "zod";

import { authProcedure, createTRPCRouter } from "../trpc";

export const thongBaoRouter = createTRPCRouter({
	getThongBao: authProcedure.query(async ({ ctx }) => {
		return ctx.prisma.thongBao.findMany({
			where: { MaNguoiDung: ctx.userId },
			include: { BanTin: { select: { DanhMuc: { select: { TenDanhMuc: true } } } } },
		});
	}),
});
