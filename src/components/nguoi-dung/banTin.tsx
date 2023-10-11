"use client";

import { Card, CardBody, CardHeader } from "@nextui-org/react";
import type { BanTinDaLuu, BanTinYeuThich } from "@prisma/client";

export const BanTin = ({ danhSachBanTin, children }: { danhSachBanTin: (BanTinDaLuu | BanTinYeuThich)[]; children: React.ReactNode }) => {
	return (
		<Card className="flex-1">
			<CardHeader>
				<h2 className="flex w-full items-center justify-center gap-2 text-2xl font-semibold">{children}</h2>
			</CardHeader>

			<CardBody>
				{danhSachBanTin.map((item) => {
					return <div key={item.MaBanTin}></div>;
				})}
			</CardBody>
		</Card>
	);
};
