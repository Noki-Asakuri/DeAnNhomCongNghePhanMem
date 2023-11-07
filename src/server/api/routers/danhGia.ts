import { authProcedure, createTRPCRouter, publicProcedure, staffProcedure } from "../trpc";

import { TRPCError } from "@trpc/server";

import z from "zod";

export const danhGiaRouter = createTRPCRouter({
	getTraLoi: publicProcedure.input(z.object({ maDanhGia: z.string() })).query(async ({ ctx, input }) => {
		return await ctx.prisma.danhGia.findMany({
			where: { MaTraLoi: input.maDanhGia },
			orderBy: { NgayDanhGia: "desc" },
			include: { NguoiDung: { include: { TaiKhoan: true } }, _count: { select: { TraLoiBoi: true } } },
		});
	}),

	getDanhGia: publicProcedure.input(z.object({ maBanTin: z.string(), pageNum: z.number() })).query(async ({ ctx, input }) => {
		return await ctx.prisma.danhGia.findMany({
			where: { MaBanTin: input.maBanTin, MaTraLoi: null },
			orderBy: { NgayDanhGia: "desc" },
			include: { NguoiDung: { include: { TaiKhoan: true } }, _count: { select: { TraLoiBoi: true } } },
			take: input.pageNum * 5,
		});
	}),

	xoaDanhGia: staffProcedure.input(z.object({ maDanhGia: z.string() })).mutation(async ({ ctx, input }) => {
		const data = await ctx.prisma.danhGia.findUnique({ where: { MaDanhGia: input.maDanhGia } });

		if (!data) throw new TRPCError({ code: "BAD_REQUEST", message: "Không tìm thấy đánh giá" });
		await ctx.prisma.danhGia.delete({ where: { MaDanhGia: data.MaDanhGia } });
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
				maTraLoi: z.string().optional(),
				noiDung: z.string().min(20, { message: "Nội dung phải có ít nhất 20 ký tự" }),
			}),
		)
		.mutation(async ({ ctx, input }) => {
			const danhGia = await ctx.prisma.danhGia.create({
				data: { NoiDung: input.noiDung, MaBanTin: input.maBanTin, MaNguoiDung: ctx.userId, MaTraLoi: input.maTraLoi },
				include: {
					TraLoiCho: { select: { MaNguoiDung: true } },
					BanTin: { select: { TenBanTin: true } },
					NguoiDung: { include: { TaiKhoan: { select: { TenTaiKhoan: true } } } },
				},
			});

			if (danhGia.TraLoiCho && danhGia.TraLoiCho.MaNguoiDung !== danhGia.MaNguoiDung) {
				const nguoiDanhGia = danhGia.NguoiDung.TaiKhoan.TenTaiKhoan,
					tenBanTin = danhGia.BanTin.TenBanTin.trim();

				const noiDungThongBao = `${nguoiDanhGia} đã trả lời 1 bình luận của bạn trong bản tin "${tenBanTin}"`;

				await ctx.prisma.thongBao.create({
					data: { DaDoc: false, NoiDung: noiDungThongBao, MaBanTin: input.maBanTin, MaNguoiDung: danhGia.TraLoiCho.MaNguoiDung },
				});
			}
		}),
});
