import { prisma } from "@/server/db/prisma";

export default async function TimKiemPage({ searchParams: { query } }: { searchParams: { query: string | undefined } }) {
	const ketQua = await prisma.banTin.findMany({ where: {} });

	if (!query || !ketQua || ketQua.length === 0) {
		return (
			<div className="container mx-auto flex flex-1 flex-col items-center justify-center gap-4 py-24">
				<h3 className="text-3xl font-bold"> Không có bản tin nào </h3>
			</div>
		);
	}

	return (
		<div className="container mx-auto flex flex-col gap-4 py-24">
			<h3 className="text-3xl font-bold"> Kết quả tìm kiếm ({ketQua.length}) </h3>

			<div className="flex flex-col gap-y-5">
				{ketQua.map((banTin) => {
					return <></>;
				})}
			</div>
		</div>
	);
}
