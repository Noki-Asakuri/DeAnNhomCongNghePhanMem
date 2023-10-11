import { Pagination } from "@/components/common/Pagination";
import { prisma } from "@/server/db/prisma";
import { encodeBanTinPath } from "@/utils/path";
import { MessagesSquare } from "lucide-react";

import type { Metadata } from "next";

import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

export const revalidate = 600;

const layData = async (tenDanhMuc: string) => {
	return prisma.danhMuc.findFirst({
		where: { TenDanhMuc: decodeURIComponent(tenDanhMuc) },
		include: { BanTin: true },
	});
};

const layDanhSachBanTin = async (maDanhMuc: string, page: number) => {
	return prisma.banTin.findMany({
		where: { MaDanhMuc: maDanhMuc },
		take: 8,
		skip: (page - 1) * 8,
		include: { DanhGia: true },
		orderBy: { NgayDang: "desc" },
	});
};

export const generateMetadata = async ({ params: { tenDanhMuc } }: { params: { tenDanhMuc: string } }): Promise<Metadata> => {
	const danhMuc = await layData(tenDanhMuc);
	if (!danhMuc) return { title: "Danh mục Không Tồn Tại" };

	return { title: danhMuc.TenDanhMuc + " - Bản Tin 24H - Nguồn Tin Tức Đa Dạng và Chính Xác" };
};

function getTotalPages(totalItems: number, perPage: number) {
	return Math.ceil(totalItems / perPage);
}

export default async function DanhMuc({
	params: { tenDanhMuc },
	searchParams: { page },
}: {
	params: { tenDanhMuc: string };
	searchParams: { page: string | undefined };
}) {
	const danhMuc = await layData(tenDanhMuc);
	if (!danhMuc) notFound();

	const pageNum = parseInt(page || "1");

	const totalPages = getTotalPages(danhMuc.BanTin.length, 8) - 1;
	const banTin = await layDanhSachBanTin(danhMuc.MaDanhMuc, pageNum);

	return (
		<div className="container mx-auto flex max-w-6xl flex-col gap-4 py-4">
			<h3 className="text-2xl font-bold">{danhMuc.TenDanhMuc}</h3>

			<div className="flex w-2/3 flex-col items-center justify-center gap-y-5">
				{banTin &&
					banTin.map((banTin) => {
						const banTinPath = encodeBanTinPath(banTin);

						return (
							<div key={`${banTin.MaBanTin}-${banTin.MaDanhMuc}`} className="grid grid-cols-[240px_auto] gap-4">
								<div className="relative aspect-video w-full overflow-hidden rounded-lg">
									<Link href={banTinPath}>
										<Image src={banTin.PreviewImage} alt={banTin.TenBanTin} fill />
									</Link>
								</div>

								<div>
									<h4 className="text-lg font-bold">
										<Link href={banTinPath}>{banTin.TenBanTin}</Link>
									</h4>
									<p>
										<Link href={banTinPath}>{banTin.NoiDungTomTat}</Link>

										<div className="inline-flex w-max items-center justify-center gap-2 pl-2">
											<MessagesSquare size={16} />
											<span className="text-blue-500/50">{banTin.DanhGia.length}</span>
										</div>
									</p>
								</div>
							</div>
						);
					})}
			</div>

			<Pagination page={pageNum} total={totalPages} url={`/danhMuc/${tenDanhMuc}`} />
		</div>
	);
}
