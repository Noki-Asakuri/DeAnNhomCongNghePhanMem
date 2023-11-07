import { authProcedure, createTRPCRouter } from "../trpc";

import z from "zod";

export const userRouter = createTRPCRouter({
	getHistoris: authProcedure
		.input(
			z.object({
				pageNum: z.number().positive("Số trang không thể âm"),
				perPage: z.number().min(1, "Số mỗi trang không thể bé hơn 1"),
			}),
		)
		.query(async ({ ctx, input }) => {
			const [newsCount, newsData] = await ctx.prisma.$transaction([
				ctx.prisma.banTinDaDoc.count({ where: { MaNguoiDung: ctx.userId } }),
				ctx.prisma.banTinDaDoc.findMany({
					where: { MaNguoiDung: ctx.userId },
					include: {
						BanTin: {
							include: {
								DanhMuc: true,
								NhanVien: { select: { TaiKhoan: { select: { AnhDaiDien: true, TenTaiKhoan: true } } } },
								_count: { select: { DanhGia: true } },
							},
						},
					},
					take: input.perPage,
					skip: Math.abs(input.pageNum - 1) * input.perPage,
					orderBy: { ReadAt: "desc" },
				}),
			]);

			return { data: newsData, count: newsCount };
		}),

	getFavorites: authProcedure
		.input(
			z.object({
				pageNum: z.number().positive("Số trang không thể âm"),
				perPage: z.number().min(1, "Số mỗi trang không thể bé hơn 1"),
			}),
		)
		.query(async ({ ctx, input }) => {
			const [newsCount, newsData] = await ctx.prisma.$transaction([
				ctx.prisma.banTinYeuThich.count({ where: { MaNguoiDung: ctx.userId } }),
				ctx.prisma.banTinYeuThich.findMany({
					where: { MaNguoiDung: ctx.userId },
					include: {
						BanTin: {
							include: {
								DanhMuc: true,
								NhanVien: { select: { TaiKhoan: { select: { AnhDaiDien: true, TenTaiKhoan: true } } } },
								_count: { select: { DanhGia: true } },
							},
						},
					},
					take: input.perPage,
					skip: Math.abs(input.pageNum - 1) * input.perPage,
					orderBy: { FavoredAt: "desc" },
				}),
			]);

			return { data: newsData, count: newsCount };
		}),

	getNotifications: authProcedure.query(async ({ ctx }) => {
		return ctx.prisma.thongBao.findMany({
			where: { MaNguoiDung: ctx.userId },
			include: { BanTin: { select: { DanhMuc: { select: { TenDanhMuc: true } } } } },
			orderBy: { CreateAt: "desc" },
		});
	}),
});
