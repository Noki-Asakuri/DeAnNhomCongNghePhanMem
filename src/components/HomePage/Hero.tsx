"use client";

import Image from "next/image";
import Typewriter from "typewriter-effect";
import { Button } from "@nextui-org/react";

const HeroMain = () => {
	return (
		<section className="h-[450px] w-full bg-yellow-500">
			<div className="flex h-full items-center justify-between">
				<div className="relative flex h-full w-2/3 flex-col items-center justify-center">
					<div className="flex flex-col gap-6">
						<h2 className="text-7xl font-bold"> Bản Tin 24h </h2>

						<h3 className="px-2 text-xl">
							Nơi bạn có thể đọc
							<br />
							các tin tức
							<Typewriter
								component={"span"}
								options={{ autoStart: true, loop: true }}
								onInit={(typewriter) => {
									typewriter
										.typeString(" Chính xác")
										.pauseFor(2000)
										.deleteAll()
										.typeString(" Nhanh chóng")
										.pauseFor(2000)
										.deleteAll()
										.typeString(" Toàn diện")
										.pauseFor(2000)
										.deleteAll()
										.start();
								}}
							/>
						</h3>

						<Button className="w-1/2" color="primary" radius="full">
							Bắt đầu đọc
						</Button>
					</div>
				</div>

				<div className="relative h-full w-1/3">
					<Image src={"/svg/heroImage.svg"} fill={true} alt="" />
				</div>
			</div>
		</section>
	);
};

export { HeroMain };
