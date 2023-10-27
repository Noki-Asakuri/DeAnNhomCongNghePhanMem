"use client";

import { api } from "@/utils/trpc/react";
import { Spinner } from "@nextui-org/react";
import { BanTinHot } from "../HomePage/BanTinHot";

export const SideNews = () => {
	const { data, isLoading, isSuccess } = api.banTin.layBanTinXemNhieu.useQuery(undefined, {
		refetchOnReconnect: false,
		refetchOnWindowFocus: false,
	});

	return (
		<section className="h-max w-1/3">
			<h4 className="pb-3 text-xl font-bold"> Xem nhiều </h4>

			<div className="flex flex-col gap-y-3">
				{isLoading && (
					<>
						<Spinner color="primary" />
					</>
				)}

				{!isLoading &&
					isSuccess &&
					data.map((banTin) => {
						return <BanTinHot key={banTin.MaBanTin} banTin={banTin} />;
					})}
			</div>
		</section>
	);
};
