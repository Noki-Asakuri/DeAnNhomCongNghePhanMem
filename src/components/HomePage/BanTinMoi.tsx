"use client";

import { encodeBanTinPath } from "@/utils/path";

import { Card, CardBody, Chip, Divider, Image, Link } from "@nextui-org/react";
import NextLink from "next/link";

import { ChiaSeDropdown } from "../chiaSeDropdown";
import type { getRandomBanTin } from "./data";

type ParamsType = { banTin: Awaited<ReturnType<typeof getRandomBanTin>>[number] };

export const BanTinMoi = ({ banTin, host, isLast }: ParamsType & { host: string; isLast: boolean }) => {
	const banTinPath = encodeBanTinPath(banTin);

	return (
		<>
			<Card isBlurred isPressable as={"div"} className="bg-background/60 dark:bg-default-100/50">
				<CardBody>
					<div className="grid grid-cols-[75%_max-content] grid-rows-[1fr_max-content] place-content-between gap-y-2">
						<NextLink href={banTinPath} className="flex flex-col gap-2">
							<h2 className="flex h-14 items-center text-xl font-semibold">{banTin.TenBanTin}</h2>
							<p className="line-clamp-2">{banTin.NoiDungTomTat}</p>
						</NextLink>

						<Link href={banTinPath} className="row-span-2 self-center">
							<Image
								classNames={{
									wrapper: "aspect-square w-32",
									img: "w-full h-full object-center object-cover",
								}}
								alt={banTin.NoiDungTomTat}
								src={banTin.PreviewImage}
							/>
						</Link>

						<div className="flex items-center justify-between">
							<Chip>
								<Link underline="hover" as={NextLink} href={`/danhMuc/${banTin.DanhMuc.TenDanhMuc}`}>
									{banTin.DanhMuc.TenDanhMuc}
								</Link>
							</Chip>

							<ChiaSeDropdown duongDanBanTin={banTinPath} host={host} tenBanTin={banTin.TenBanTin} />
						</div>
					</div>
				</CardBody>
			</Card>

			{!isLast && <Divider orientation="horizontal" />}
		</>
	);
};
