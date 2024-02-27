import { prisma } from "@/server/db/prisma";

import { Divider, Link, User } from "@nextui-org/react";

export const BottomFooter = async () => {
	const userCount = await prisma.taiKhoan.count();

	return (
		<footer className="container max-w-6xl flex-none py-4">
			<Divider orientation="horizontal" />

			<div className="grid grid-cols-[1fr_max-content_max-content_max-content_1fr] py-4">
				<div className="flex flex-col items-center justify-center text-center">
					<h3 className="font-bold">Bản tin tiếng Việt được {userCount} người đọc</h3>
					<p>Thuộc Khoa Công nghệ phần mềm</p>
				</div>

				<Divider orientation="vertical" className="mx-4" />

				<div className="flex flex-col gap-2 text-center">
					<h3>Danh sách Devs</h3>
					<div className="grid grid-cols-[1fr,max-content,1fr] place-items-start gap-y-2">
						<User
							name="Phùng Tấn Phát"
							description={
								<>
									<span>Main Dev - </span>
									<Link underline="hover" href="https://github.com/Noki-Asakuri" size="sm" isExternal>
										@Noki-Asakuri
									</Link>
								</>
							}
							avatarProps={{
								showFallback: true,
								src: "https://avatars.githubusercontent.com/u/41738319?s=400&v=4",
							}}
						/>

						<Divider orientation="vertical" className="row-span-2 mx-4" />

						<User
							name="Trần Thanh Phú"
							description={
								<>
									<span>Dev 2</span>
								</>
							}
							avatarProps={{
								showFallback: true,
								src: "https://cdn.discordapp.com/avatars/896566728425881611/76bdbe48386a95c3f13a340698a18def.webp?size=256",
							}}
						/>

						<User
							name="Nguyễn Minh Trí"
							description={
								<>
									<span>Dev 3 (Ngoại tuyến)</span>
								</>
							}
							avatarProps={{
								showFallback: true,
								src: "https://s120-ava-talk.zadn.vn/b/8/e/e/7/120/24a434a4ada0980baa7a0ff33e40200c.jpg",
							}}
						/>

						<User
							name="Lâm Võ Minh Nhật"
							description={
								<>
									<span>Dev 4</span>
								</>
							}
							avatarProps={{
								showFallback: true,
								src: "https://cdn.discordapp.com/avatars/627417003531173888/b48eadf5b0ce583aab41d64734aaaa10.webp?size=256",
							}}
						/>
					</div>
				</div>

				<Divider orientation="vertical" className="mx-4" />

				<div className="flex items-center justify-center text-center">
					<span>
						Địa chỉ: 10 QL22, Tân Xuân, Hóc Môn, <br /> Thành phố Hồ Chí Minh, Việt Nam
					</span>
				</div>
			</div>
		</footer>
	);
};
