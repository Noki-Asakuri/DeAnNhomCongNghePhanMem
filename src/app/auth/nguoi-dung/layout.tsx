import { NguoiDungSideBar } from "@/components/nguoi-dung/side-bar";

import type { ReactNode } from "react";

export default function NguoiDungLayout({ children }: { children: ReactNode }) {
	return (
		<div className="container mx-auto flex max-w-6xl flex-1 gap-2 py-5">
			<NguoiDungSideBar />

			<div className="flex w-4/5">{children}</div>
		</div>
	);
}
