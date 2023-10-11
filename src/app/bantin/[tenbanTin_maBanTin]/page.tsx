import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import ReactMarkdown from "react-markdown";

// import { DanhGiaBanTin } from "@/components/ban-tin/DanhGia";
// import { ThanhCongCu } from "@/components/ban-tin/thanhCongCu";

// import { DanhDauDaXemBanTin } from "@/components/ban-tin/DanhDauDaXemBanTin";

import { encodeBanTinPath } from "@/utils/path";

import { currentUser } from "@clerk/nextjs";
import { headers } from "next/headers";
import { checkDaLuuBanTin, layBanTin, layBanTinXemNhieu } from "./data";

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
	const [banTin, banTinXemNhieu, isLuuBanTin] = await Promise.all([
		layBanTin(tenbanTin_maBanTin),
		layBanTinXemNhieu(tenbanTin_maBanTin),
		checkDaLuuBanTin(tenbanTin_maBanTin, user?.id),
	]);

	const host = headers().get("host");

	const dateFormatter = new Intl.DateTimeFormat("vi", { dateStyle: "full" });
	const timeFormatter = new Intl.DateTimeFormat("vi", { timeStyle: "long" });

	if (!banTin) notFound();

	return (
		<>
			{/* {user && <DanhDauDaXemBanTin user={user} banTin={banTin} />} */}
			<div className="container mx-auto flex max-w-6xl flex-col gap-4 py-4">
				<div className="flex gap-4">
					<section className="w-2/3">
						<div className="flex items-center justify-between">
							<div>
								<Link href={`/danhMuc/${banTin.DanhMuc.TenDanhMuc}`} className="text-blue-600 hover:text-blue-400">
									{banTin.DanhMuc.TenDanhMuc}
								</Link>
							</div>

							<div className="pr-4">
								{dateFormatter.format(banTin.NgayDang)}, lúc {timeFormatter.format(banTin.NgayDang)}
							</div>
						</div>

						<div className="rounded-br-lg border-b-[1px] border-r-[1px] border-[#262626]/60 pr-4">
							<h1 className="py-5 text-3xl font-bold"> {banTin.TenBanTin} </h1>
							<ReactMarkdown
								className="[&>p]:pb-5"
								components={{
									// eslint-disable-next-line @typescript-eslint/no-unused-vars
									img: ({ node, alt, src, ...prop }) => (
										<span className="flex flex-col gap-y-2">
											{/* eslint-disable-next-line @next/next/no-img-element */}
											<img src={src as string} alt={alt as string} {...prop} className="w-full rounded-lg" />
											<span className="text-sm text-gray-600 dark:text-gray-300">{alt}</span>
										</span>
									),
								}}
							>
								{banTin.NoiDung}
							</ReactMarkdown>
						</div>

						<div className="flex items-center justify-end pr-4 pt-5">
							<span className="text-xl font-bold">{banTin.NhanVien.TenNhanVien}</span>
						</div>

						{/* <ThanhCongCu banTin={banTin} host={host as string} user={user} daLuu={isLuuBanTin} />
						<DanhGiaBanTin banTin={banTin} user={user} /> */}
					</section>

					{/* <section className="h-max w-1/3 py-3">
						<h4 className="pb-3 text-xl font-bold"> Xem nhiều </h4>

						<div className="flex flex-col gap-y-3">
							{banTinXemNhieu.map((banTin, i) => {
								const banTinPath = encodeBanTinPath(banTin);

								return (
									<>
										<Link href={banTinPath} key={banTin.MaBanTin}>
											<div className="grid grid-cols-[110px_1fr] gap-2">
												<div className="relative aspect-video w-full">
													<Image src={banTin.PreviewImage} alt={banTin.TenBanTin} fill className="rounded-lg" />
												</div>
												<div className="self-center text-sm">
													<span>{banTin.TenBanTin}</span>
												</div>
											</div>
										</Link>

										{i < banTinXemNhieu.length - 1 && (
											// <Separator orientation="horizontal" className="dark:bg-gray-500/60" />
											<div></div>
										)}
									</>
								);
							})}
						</div>
					</section> */}
				</div>
			</div>
		</>
	);
}
