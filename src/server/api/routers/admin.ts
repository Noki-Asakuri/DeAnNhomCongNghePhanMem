import type { allNewsAction } from "@/components/admin/news/data";
import { disAllowedRoles } from "@/components/admin/user/data";
import { env } from "@/env.mjs";

import { adminProcedure, createTRPCRouter, publicProcedure, staffProcedure } from "../trpc";

import { clerkClient } from "@clerk/nextjs";
import type { Prisma, Role, TrangThai } from "@prisma/client";
import { TRPCError } from "@trpc/server";

import z from "zod";

export const adminRouter = createTRPCRouter({
	getCurrentUser: publicProcedure
		.input(
			z.object({
				allowedRoles: z.custom<Role>().array().optional(),
			}),
		)
		.query(async ({ ctx, input }) => {
			if (!ctx.userId) return null;

			const user = await ctx.prisma.taiKhoan.findUnique({ where: { MaTaiKhoan: ctx.userId } });
			if (!user) return null;

			if (!input.allowedRoles) return user;
			if (input.allowedRoles.includes(user.VaiTro)) return user;

			return null;
		}),

	getUsers: adminProcedure
		.input(
			z.object({
				pageNum: z.number().positive("Số trang không được âm").optional(),
				perPage: z.number().min(1, "Số lượng mỗi trang phải lớn hơn 1").optional(),
				query: z
					.object({
						value: z.string().optional(),
						valueType: z.enum(["ID", "Name", "SDT", "Email"]).optional(),

						queryRoles: z.custom<Role>().array(),
					})
					.optional(),
			}),
		)
		.query(async ({ ctx, input }) => {
			const nullPhoneNumbers = ["Không Có".toLowerCase(), "null", "undefined"];
			const trimmedValue = (input.query?.value ?? "").trim();

			const search: Prisma.TaiKhoanWhereInput = {
				AND: [
					input.query && !!input.query.queryRoles.length ? { OR: input.query.queryRoles.map((role) => ({ VaiTro: role })) } : {},
					input.query && !!trimmedValue.length
						? {
								...(input.query.valueType === "ID" ? { MaTaiKhoan: { contains: trimmedValue } } : {}),
								...(input.query.valueType === "Email" ? { Email: { contains: trimmedValue } } : {}),
								...(input.query.valueType === "Name" ? { TenTaiKhoan: { contains: trimmedValue } } : {}),
								...(input.query.valueType === "SDT"
									? { SoDT: nullPhoneNumbers.includes(trimmedValue) ? null : { contains: trimmedValue } }
									: {}),
						  }
						: {},
				],
			};

			const [userCount, userData] = await ctx.prisma.$transaction([
				ctx.prisma.taiKhoan.count({ where: search }),
				ctx.prisma.taiKhoan.findMany({
					where: search,
					include: { NguoiDung: true, NhanVien: { include: { _count: { select: { BanTin: true } } } } },
					take: input.perPage,
					skip: input.perPage && input.pageNum ? Math.abs(input.pageNum - 1) * input.perPage : undefined,
				}),
			]);

			const data = userData.map((_user) => {
				const { NguoiDung: _NguoiDung, ...user } = _user;
				// eslint-disable-next-line @typescript-eslint/no-unused-vars
				const { MaNguoiDung: _MaNguoiDung, ...KhachHang } = _NguoiDung!;

				return { ...user, ...KhachHang };
			});

			return { data, count: userCount };
		}),

	updateUser: adminProcedure
		.input(
			z.object({
				maTaiKhoan: z.string(),
				data: z.discriminatedUnion("type", [
					z.object({
						type: z.literal("Update"),
						role: z.custom<Role>().optional(),
					}),
					z.object({
						type: z.literal("Delete"),
					}),
					z.object({
						type: z.literal("Ban"),
					}),
					z.object({
						type: z.literal("Unban"),
					}),
				]),
			}),
		)
		.mutation(async ({ ctx, input }) => {
			const currentUser = await ctx.prisma.taiKhoan.findFirst({
				where: { MaTaiKhoan: input.maTaiKhoan },
			});

			if (!currentUser) throw new TRPCError({ code: "UNPROCESSABLE_CONTENT", message: "Tài khoản không tồn tại!" });

			switch (input.data.type) {
				case "Update": {
					if (input.data.role) {
						const staffRoles: Role[] = ["NhanVien", "QuanTriVien", "TongBienTap"];

						if (input.data.role === "KhachHang" && staffRoles.includes(currentUser.VaiTro)) {
							await ctx.prisma.taiKhoan.update({
								where: { MaTaiKhoan: input.maTaiKhoan },
								data: {
									VaiTro: input.data.role,
									NhanVien: { delete: { MaTaiKhoan: input.maTaiKhoan } },
								},
							});
						} else if (staffRoles.includes(input.data.role) && currentUser.VaiTro === "KhachHang") {
							await ctx.prisma.taiKhoan.update({
								where: { MaTaiKhoan: input.maTaiKhoan },
								data: {
									VaiTro: input.data.role,
									NhanVien: {
										connectOrCreate: {
											create: { MaNhanVien: input.maTaiKhoan },
											where: { MaTaiKhoan: input.maTaiKhoan },
										},
									},
								},
							});
						}
					}

					break;
				}
				case "Delete": {
					if (disAllowedRoles.includes(currentUser.VaiTro))
						throw new TRPCError({
							code: "BAD_REQUEST",
							message: `Không thể xóa tài khoản với chức vụ "Quản trị viên" hoặc "Tổng Biên Tập", vui lòng kiểm tra lại, hoặc cập nhật chức vụ người dùng và thử lại!`,
						});

					await ctx.prisma.taiKhoan.delete({ where: { MaTaiKhoan: input.maTaiKhoan } });
					await clerkClient.users.deleteUser(input.maTaiKhoan);

					break;
				}

				case "Ban":
				case "Unban": {
					if (disAllowedRoles.includes(currentUser.VaiTro))
						throw new TRPCError({
							code: "BAD_REQUEST",
							message: `Không thể cấm tài khoản với chức vụ "Quản trị viên" hoặc "Tổng Biên Tập", vui lòng kiểm tra lại, hoặc cập nhật chức vụ người dùng và thử lại!`,
						});

					// NOTE: Clerk không có tính năng ban/unban, nên phải tự fetch tới api endpoint của clerk, và update db của mình
					const res = await fetch(`https://api.clerk.com/v1/users/${input.maTaiKhoan}/${input.data.type.toLowerCase()}`, {
						method: "POST",
						headers: {
							"Content-Type": "application/json",
							Connection: "keep-alive",
							Authorization: "Bearer " + env.CLERK_SECRET_KEY,
						},
					});

					if (res.ok) {
						await ctx.prisma.taiKhoan.update({
							where: { MaTaiKhoan: input.maTaiKhoan },
							data: { Banned: input.data.type === "Ban" },
						});
					}

					break;
				}
			}
		}),

	// News Manage
	updateCategory: adminProcedure
		.input(
			z.discriminatedUnion("type", [
				z.object({
					type: z.literal("Add"),
					TenDanhMuc: z.string().min(2, "Tên danh mục phải dài hơn 2 ký tự!"),
				}),
				z.object({
					type: z.literal("Edit"),
					MaDanhMuc: z.string().min(1, "Mã danh mục không được để trống!"),
					TenDanhMuc: z.string().min(2, "Tên danh mục phải dài hơn 2 ký tự!"),
				}),
				z.object({
					type: z.literal("Delete"),
					MaDanhMuc: z.string().min(1, "Mã danh mục không được để trống!"),
				}),
			]),
		)
		.mutation(async ({ ctx, input }) => {
			switch (input.type) {
				case "Add": {
					const existCategory = await ctx.prisma.danhMuc.count({
						where: { TenDanhMuc: input.TenDanhMuc },
					});

					if (!!existCategory) {
						throw new TRPCError({ code: "BAD_REQUEST", message: "Tên danh mục đã tồn tại" });
					}

					await ctx.prisma.danhMuc.create({ data: { TenDanhMuc: input.TenDanhMuc } });
					break;
				}

				case "Edit": {
					const [existCategory, currentDanhMuc] = await ctx.prisma.$transaction([
						ctx.prisma.danhMuc.count({ where: { TenDanhMuc: input.TenDanhMuc } }),
						ctx.prisma.danhMuc.count({ where: { MaDanhMuc: input.MaDanhMuc } }),
					]);

					if (!currentDanhMuc) {
						throw new TRPCError({ code: "BAD_REQUEST", message: "Danh mục không tồn tại" });
					}

					if (!!existCategory) {
						throw new TRPCError({ code: "BAD_REQUEST", message: "Tên danh mục đã tồn tại" });
					}

					await ctx.prisma.danhMuc.update({
						where: { MaDanhMuc: input.MaDanhMuc },
						data: { TenDanhMuc: input.TenDanhMuc },
					});

					break;
				}

				case "Delete": {
					const currentCategory = await ctx.prisma.danhMuc.findUnique({
						where: { MaDanhMuc: input.MaDanhMuc },
						select: { _count: { select: { BanTin: true } }, TenDanhMuc: true },
					});

					if (!currentCategory) {
						throw new TRPCError({ code: "BAD_REQUEST", message: "Danh mục không tồn tại" });
					}

					if (currentCategory._count.BanTin > 0) {
						throw new TRPCError({
							code: "CONFLICT",
							message: `Vẫn còn ${currentCategory._count.BanTin} bản tin với danh mục "${currentCategory.TenDanhMuc}", vui lòng chuyển bản tin với 1 danh mục khác trước khi xóa!`,
						});
					}

					await ctx.prisma.danhMuc.delete({ where: { MaDanhMuc: input.MaDanhMuc } });
					break;
				}
			}
		}),

	updateNews: staffProcedure
		.input(
			z.object({
				type: z.custom<(typeof allNewsAction)[number]>(),
				maBanTin: z.string(),
			}),
		)
		.mutation(async ({ ctx, input }) => {
			const status: Record<(typeof allNewsAction)[number], TrangThai> = {
				approveNew: "APPROVED",
				disapproveNew: "UNAPPROVED",
				markFinish: "FINISHED",
				markUnfinish: "UNFINISHED",
				requestApprove: "WAITING",
				cancelRequest: "WAITING",
			};

			await ctx.prisma.banTin.update({ where: { MaBanTin: input.maBanTin }, data: { TrangThai: status[input.type] } });
		}),

	getNews: staffProcedure
		.input(
			z.object({
				pageNum: z.number(),
				perPage: z.number().min(1, "Số lượng mỗi trang phải lớn hơn 1"),
				query: z
					.object({
						value: z.string(),
						valueType: z.enum(["ID", "Name", "NoiDung"]),

						queryStatus: z.custom<TrangThai>().array(),
						queryCategories: z.string().array(),
						queryStaff: z.string().array(),
					})
					.optional(),
			}),
		)
		.query(async ({ ctx, input }) => {
			const user = await ctx.prisma.taiKhoan.findUnique({ where: { MaTaiKhoan: ctx.userId } });

			if (!user) {
				throw new TRPCError({
					code: "PRECONDITION_FAILED",
					message: "Không tìm thấy tài khoản, vui lòng liên hệ quản trị viên để hỗ trợ thêm!",
				});
			}

			const trimmedValue = (input.query?.value ?? "").trim();

			const search: Prisma.BanTinWhereInput = {
				AND: [
					user.VaiTro === "NhanVien" ? { MaNhanVien: user.MaTaiKhoan } : {},
					input.query && !!input.query.queryStatus.length
						? { OR: input.query.queryStatus.map((status) => ({ TrangThai: status })) }
						: {},

					input.query && !!input.query.queryStaff.length
						? { OR: input.query.queryStaff.map((maNV) => ({ MaNhanVien: maNV })) }
						: {},

					input.query && !!input.query.queryCategories.length
						? { OR: input.query.queryCategories.map((category) => ({ MaDanhMuc: category })) }
						: {},

					input.query && !!trimmedValue.length
						? {
								...(input.query.valueType === "ID" ? { MaBanTin: { contains: trimmedValue } } : {}),
								...(input.query.valueType === "Name" ? { TenBanTin: { contains: trimmedValue } } : {}),
								...(input.query.valueType === "NoiDung" ? { NoiDung: { contains: trimmedValue } } : {}),
						  }
						: {},
				],
			};

			const [newCount, newData] = await ctx.prisma.$transaction([
				ctx.prisma.banTin.count({ where: search }),
				ctx.prisma.banTin.findMany({
					where: search,
					include: {
						DanhMuc: true,
						NhanVien: { include: { TaiKhoan: true } },
						_count: { select: { BanTinYeuThich: true, DanhGia: true } },
					},
					take: input.perPage,
					skip: Math.abs(input.pageNum - 1) * input.perPage,
				}),
			]);

			const data = newData.map((_banTin) => {
				const { DanhMuc: _DanhMuc, _count, ...banTin } = _banTin;
				// eslint-disable-next-line @typescript-eslint/no-unused-vars
				const { TenDanhMuc } = _DanhMuc;

				return { ...banTin, TenDanhMuc, count: _count };
			});

			return { data, count: newCount };
		}),
});
