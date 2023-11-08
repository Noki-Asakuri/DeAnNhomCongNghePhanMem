import { authProcedure, createTRPCRouter, publicProcedure } from "../trpc";

import type { Prisma } from "@prisma/client";

import z from "zod";

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

	layBanTinXemNhieu: publicProcedure.input(z.object({ excludeID: z.string() })).query(async ({ ctx, input }) => {
		return await ctx.prisma.banTin.findMany({
			where: { NOT: { MaBanTin: input.excludeID } },
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

	searchBanTin: publicProcedure
		.input(
			z.object({
				pageNum: z.number().min(0, "Số trang phải lớn hơn 0"),
				perPage: z.number().min(1, "Số lượng từng trang phải lớn hơn 1"),
				query: z
					.object({
						value: z.string().optional(),
						author: z.string().optional(),
						category: z.string().optional(),
					})
					.optional(),
			}),
		)
		.query(async ({ ctx, input }) => {
			const trimValue = (input.query?.value ?? "").trim();

			const search: Prisma.BanTinWhereInput = {
				AND: [
					input.query?.value ? { OR: [{ TenBanTin: { contains: trimValue } }, { NoiDungTomTat: { contains: trimValue } }] } : {},
					input.query?.author ? { MaNhanVien: input.query.author } : {},
					input.query?.category ? { MaDanhMuc: input.query.category } : {},
				],
			};

			const [newsCount, newsData] = await ctx.prisma.$transaction([
				ctx.prisma.banTin.count({ where: search }),
				ctx.prisma.banTin.findMany({
					where: search,
					include: {
						DanhMuc: true,
						NhanVien: { include: { TaiKhoan: { select: { AnhDaiDien: true, TenTaiKhoan: true } } } },
						_count: { select: { DanhGia: true } },
					},
					take: input.perPage,
					skip: Math.abs(input.pageNum - 1) * input.perPage,
				}),
			]);

			return { data: newsData, count: newsCount };
		}),
});
