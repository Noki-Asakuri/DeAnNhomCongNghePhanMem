import { DanhGiaBanTin } from "@/components/ban-tin/DanhGia";
import { SideNews } from "@/components/ban-tin/SideNews";
import { ThanhCongCu } from "@/components/ban-tin/ThanhCongCu";
import { Link } from "@/components/common/Link";

import { layBanTin } from "./data";
import { NoiDung } from "./noiDung";

import type { Metadata } from "next";
import { headers } from "next/headers";
import NextLink from "next/link";
import { notFound } from "next/navigation";

import { currentUser } from "@clerk/nextjs";

type Params = { params: { tenbanTin_maBanTin: string } };
export const revalidate = 600;

export const generateMetadata = async ({ params: { tenbanTin_maBanTin } }: Params): Promise<Metadata> => {
	const banTin = await layBanTin(tenbanTin_maBanTin);
	if (!banTin) return { title: "Bản Tin Không Tồn Tại" };

	return {
		title: banTin.TenBanTin,
		description: banTin.NoiDungTomTat,
	};
};

export default async function BanTinPage({ params: { tenbanTin_maBanTin } }: Params) {
	const user = await currentUser();

	const banTin = await layBanTin(tenbanTin_maBanTin);

	const host = headers().get("host");

	const dateFormatter = new Intl.DateTimeFormat("vi", { dateStyle: "full" });
	const timeFormatter = new Intl.DateTimeFormat("vi", { timeStyle: "long" });

	if (!banTin) notFound();

	return (
		<>
			<div className="container mx-auto flex max-w-6xl flex-col gap-4 py-4">
				<div className="flex gap-4">
					<section className="w-2/3">
						<div className="flex items-center justify-between">
							<div>
								<Link as={NextLink} href={`/danhMuc/${banTin.DanhMuc.TenDanhMuc}`} underline="hover">
									{banTin.DanhMuc.TenDanhMuc}
								</Link>
							</div>

							<div className="pr-4">
								{dateFormatter.format(banTin.NgayDang)}, lúc {timeFormatter.format(banTin.NgayDang)}
							</div>
						</div>

						<div className="rounded-br-lg border-b-[1px] border-r-[1px] border-[#262626]/60 pr-4">
							<h1 className="py-5 text-3xl font-bold"> {banTin.TenBanTin} </h1>

							<NoiDung maBanTin={banTin.MaBanTin}>{banTin.NoiDung}</NoiDung>
						</div>

						<div className="flex items-center justify-end pr-4 pt-5">
							<span className="text-xl font-bold">{banTin.NhanVien.TaiKhoan.TenTaiKhoan}</span>
						</div>

						<ThanhCongCu banTin={banTin} host={host as string} />
						<DanhGiaBanTin banTin={banTin} userJSON={user ? JSON.stringify(user) : null} />
					</section>

					<SideNews excludeID={banTin.MaBanTin} />
				</div>
			</div>
		</>
	);
}
