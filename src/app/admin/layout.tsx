import { AdminNavbar } from "@/components/admin/AdminNavbar";

import type { ReactNode } from "react";

export default function AdminLayout({ children }: { children: ReactNode }) {
	return (
		<main className="container flex max-w-6xl flex-grow flex-col gap-2 pt-4">
			<AdminNavbar />

			<section className="flex flex-grow">{children}</section>
		</main>
	);
}
