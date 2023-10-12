"use client";

import type { layBanTin } from "@/app/bantin/[tenbanTin_maBanTin]/data";
import { danhDauDaXemBanTin } from "@/server/action/xemBanTin";

import type { User } from "@clerk/clerk-sdk-node";
import { useEffect, useRef } from "react";

export function DanhDauDaXemBanTin({ banTin, user }: { banTin: Awaited<ReturnType<typeof layBanTin>>; user: User }) {
	const ref = useRef<HTMLInputElement>(null);

	useEffect(() => {
		const timeout = setTimeout(() => {
			ref.current?.click();
		}, 4000);

		return () => clearTimeout(timeout);
	}, []);

	return (
		<form
			hidden
			// eslint-disable-next-line @typescript-eslint/no-misused-promises
			action={async () => await danhDauDaXemBanTin({ maBanTin: banTin!.MaBanTin, maNguoiDung: user.id })}
		>
			<input ref={ref} type="submit" hidden />
		</form>
	);
}
