import z from "zod";

import { authProcedure, publicProcedure, router } from "../trpc";
import { TRPCError } from "@trpc/server";

export const danhGiaRouter = router({
	getDanhGia: publicProcedure.input(z.object({ maBanTin: z.string() })).query(async ({ ctx, input }) => {
		return await ctx.prisma.danhGia.findMany({
			where: { MaBanTin: input.maBanTin, MaTraLoi: null },
			orderBy: { NgayDanhGia: "desc" },
			take: 10,
			include: {
				NguoiDung: { include: { TaiKhoan: true } },
				_count: { select: { DanhGiaLikes: true } },
				TraLoiBoi: {
					orderBy: { NgayDanhGia: "desc" },
					include: {
						NguoiDung: { include: { TaiKhoan: true } },
						_count: { select: { DanhGiaLikes: true } },
					},
				},
			},
		});
	}),
	checkThichDanhGia: publicProcedure.input(z.object({ maDanhGia: z.string() })).query(async ({ ctx, input }) => {
		if (!ctx.userId) return false;
		return !!(await ctx.prisma.danhGiaLikes.count({ where: { MaDanhGia: input.maDanhGia, MaNguoiDung: ctx.userId } }));
	}),
	thichDanhGia: authProcedure.input(z.object({ maDanhGia: z.string() })).mutation(async ({ ctx, input }) => {
		const isLiked = await ctx.prisma.danhGiaLikes.count({ where: { MaDanhGia: input.maDanhGia, MaNguoiDung: ctx.userId } });

		if (isLiked) {
			await ctx.prisma.danhGiaLikes.delete({
				where: { MaDanhGia_MaNguoiDung: { MaDanhGia: input.maDanhGia, MaNguoiDung: ctx.userId } },
			});
			return;
		}
		await ctx.prisma.danhGiaLikes.create({ data: { MaDanhGia: input.maDanhGia, MaNguoiDung: ctx.userId } });
	}),
	danhGiaBanTin: authProcedure
		.input(
			z.object({
				maBanTin: z.string(),
				maNguoiDung: z.string(),
				maTraLoi: z.string().optional(),
				noiDung: z.string(),
			}),
		)
		.mutation(async ({ ctx, input }) => {
			if (input.noiDung.length < 20) {
				throw new TRPCError({ code: "BAD_REQUEST", message: "Nội dung phải có ít nhất 20 ký tự" });
			}

			await ctx.prisma.danhGia.create({
				data: {
					NoiDung: input.noiDung,
					MaBanTin: input.maBanTin,
					MaNguoiDung: input.maNguoiDung,
					MaTraLoi: input.maTraLoi,
				},
			});
		}),
});
