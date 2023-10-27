import z from "zod";

import { authProcedure, createTRPCRouter, publicProcedure } from "../trpc";

export const banTinRouter = createTRPCRouter({
	yeuThich: authProcedure.input(z.object({ maBanTin: z.string() })).mutation(async ({ ctx, input }) => {
		const isFavorite = await ctx.prisma.banTinYeuThich.count({ where: { MaBanTin: input.maBanTin, MaNguoiDung: ctx.userId } });

		// đã yêu thích => bỏ yêu thích
		if (isFavorite) {
			await ctx.prisma.banTinYeuThich.delete({
				where: { MaBanTin_MaNguoiDung: { MaBanTin: input.maBanTin, MaNguoiDung: ctx.userId } },
			});
			return;
		}
		// Chưa Yêu thích => Yêu Thích
		await ctx.prisma.banTinYeuThich.create({
			data: { MaBanTin: input.maBanTin, MaNguoiDung: ctx.userId },
		});
	}),
	checkYeuThich: publicProcedure.input(z.object({ maBanTin: z.string() })).query(async ({ ctx, input }) => {
		if (!ctx.userId) return false;
		return !!(await ctx.prisma.banTinYeuThich.count({ where: { MaBanTin: input.maBanTin, MaNguoiDung: ctx.userId } }));
	}),

	layBanTinXemNhieu: publicProcedure.query(async ({ ctx }) => {
		return await ctx.prisma.banTin.findMany({
			take: 5,
			orderBy: { LuoiXem: "desc" },
			include: { DanhMuc: { select: { TenDanhMuc: true } }, _count: { select: { DanhGia: true } } },
		});
	}),
	markAsRead: authProcedure.input(z.object({ maBanTin: z.string() })).mutation(async ({ ctx, input }) => {
		const checkIsRead = await ctx.prisma.banTinDaDoc.count({ where: { MaBanTin: input.maBanTin, MaNguoiDung: ctx.userId } });

		if (checkIsRead) {
			const currentDate = new Date();

			await ctx.prisma.banTin.update({
				where: { MaBanTin: input.maBanTin },
				data: {
					LuoiXem: { increment: 1 },
					BanTinDaDoc: {
						update: {
							where: { MaBanTin_MaNguoiDung: { MaBanTin: input.maBanTin, MaNguoiDung: ctx.userId } },
							data: { ReadAt: currentDate },
						},
					},
				},
			});

			return;
		}

		await ctx.prisma.banTin.update({
			where: { MaBanTin: input.maBanTin },
			data: {
				LuoiXem: { increment: 1 },
				BanTinDaDoc: {
					connectOrCreate: {
						create: { MaNguoiDung: ctx.userId },
						where: { MaBanTin_MaNguoiDung: { MaBanTin: input.maBanTin, MaNguoiDung: ctx.userId } },
					},
				},
			},
		});
	}),
});
