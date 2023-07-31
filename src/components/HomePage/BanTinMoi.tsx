"use client";

import Image from "next/image";
import Link from "next/link";

import type { InferModel } from "drizzle-orm";

import type { BanTinTable } from "@/server/db/schema/banTin";
import type { DanhMucTable } from "@/server/db/schema/danhMuc";

import { Badge } from "@ui/badge";
import { encodeBanTinPath } from "@/utils/path";
import { Share } from "lucide-react";

type ParamsType = { banTin: InferModel<typeof BanTinTable, "select"> & { danhMuc: InferModel<typeof DanhMucTable, "select"> | null } };

const BanTinMoi = ({ banTin }: ParamsType) => {
	const banTinPath = encodeBanTinPath(banTin);

	return (
		<div className="grid grid-cols-[1fr_minmax(auto,20%)] gap-2">
			<Link href={banTinPath} className="col-span-2 h-full overflow-hidden">
				<div className="grid grid-cols-[1fr_minmax(auto,20%)] gap-5">
					<div className="place-self-center">
						<h4 className="text-xl font-bold">{banTin.tenBanTin}</h4>
						<p className="line-clamp-2">{banTin.noiDungTomTat}</p>
					</div>

					<div className="relative flex aspect-square h-full w-full items-center justify-center">
						<div className="h-max w-full">
							<Image fill alt="" src={banTin.hinhNho} className="!relative h-max rounded-lg object-contain object-center" />
						</div>
					</div>
				</div>
			</Link>
			<div className="flex items-center justify-between">
				<Badge variant="default" className="w-max">
					{banTin.danhMuc?.tenDanhMuc}
				</Badge>

				<div className="">
					<button title="Chia sẽ bản tin này">
						<Share size={22} />
					</button>
				</div>
			</div>
		</div>
	);
};

export { BanTinMoi };
