import { BanTinHot } from "@/components/HomePage/BanTinHot";
import { BanTinMoi } from "@/components/HomePage/BanTinMoi";
import { HeroMain } from "@/components/HomePage/Hero";
import { SideBar } from "@/components/HomePage/Sidebar";
import { getBanTinHot, getDanhMuc, getRandomBanTin } from "@/components/HomePage/data";
import { Divider } from "@/components/common/Divider";

import { Newspaper } from "lucide-react";
import { headers } from "next/headers";

export const dynamic = "force-dynamic",
	fetchCache = "default-no-store";

export default async function Home() {
	const host = headers().get("host") as string;
	const [banTin, banTinRandom, danhMuc] = await Promise.all([getBanTinHot(), getRandomBanTin(), getDanhMuc()]);

	return (
		<>
			<HeroMain />

			<section className="container flex h-max max-w-6xl flex-col gap-y-5 py-5">
				<h2 className="flex gap-3">
					<Newspaper size={20} />
					Các bản tin <strong className="text-red-500"> HOT </strong>{" "}
				</h2>

				<div className="grid h-max grid-cols-1 items-center gap-5 md:grid-cols-2 lg:grid-cols-3">
					{banTin.map((item) => (
						<BanTinHot key={item.MaBanTin} banTin={item} />
					))}
				</div>
			</section>

			<section className="container flex h-max max-w-6xl flex-col py-5">
				<div className="w-full">
					<p className="font-semibold">Bạn có thể quan tâm</p>
				</div>

				<Divider orientation="horizontal" />

				<div className="grid w-full grid-cols-[70%,max-content,1fr]">
					<div className="flex flex-col gap-y-5 py-5">
						{banTinRandom.map((bt, index) => {
							return <BanTinMoi key={bt.MaBanTin} banTin={bt} host={host} isLast={index + 1 === banTinRandom.length} />;
						})}
					</div>

					<Divider orientation="vertical" className="mx-4 w-px" />

					<div className="py-5">
						<SideBar danhMuc={danhMuc} />
					</div>
				</div>
			</section>
		</>
	);
}
