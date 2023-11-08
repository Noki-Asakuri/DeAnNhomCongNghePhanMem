import { createTRPCRouter, publicProcedure } from "../trpc";

import { TRPCError } from "@trpc/server";

export const commonRouter = createTRPCRouter({
	getUser: publicProcedure.query(async ({ ctx }) => {
		if (!ctx.userId) return null;

		const user = await ctx.prisma.taiKhoan.findFirst({ where: { MaTaiKhoan: ctx.userId } });
		if (!user) {
			throw new TRPCError({
				code: "NOT_FOUND",
				message: "Không tìm thấy tài khoản với mã id này, vui lòng liên hệ với quản trị viên trang để giải quyết!",
			});
		}

		return user;
	}),

	getCategories: publicProcedure.query(async ({ ctx }) => {
		return await ctx.prisma.danhMuc.findMany();
	}),

	getAuthors: publicProcedure.query(async ({ ctx }) => {
		return await ctx.prisma.taiKhoan.findMany({
			where: { VaiTro: "NhanVien" },
			select: { AnhDaiDien: true, TenTaiKhoan: true, MaTaiKhoan: true },
		});
	}),

	getUserCount: publicProcedure.query(async ({ ctx }) => {
		return ctx.prisma.taiKhoan.count();
	}),
});
