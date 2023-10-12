// "use client";

// import { danhGiaBanTin, traLoiDanhGia } from "@/server/action/danhGia";
// import { dayjs } from "@/utils/dayjs";

// import Image from "next/image";
// import { usePathname } from "next/navigation";

// import type { User } from "@clerk/clerk-sdk-node";
// import { MessagesSquare, ThumbsUp } from "lucide-react";
// import { useMemo, useRef, useState, type Dispatch, type SetStateAction } from "react";
// import type { layBanTin } from "@/app/bantin/[tenbanTin_maBanTin]/data";

// type ParamsType = {
// 	banTin: Awaited<ReturnType<typeof layBanTin>>;
// 	user: User | null;
// };

// export const DanhGiaBanTin = ({ banTin, user }: ParamsType) => {
// 	const currentPathName = usePathname();
// 	const [isTraLoi, setTrangThaiTraLoi] = useState<string | undefined>();

// 	if (banTin?.DanhGia.length === 0)
// 		return (
// 			<div className="flex flex-col gap-4 pt-4">
// 				<h3 className="text-2xl font-bold">Đánh Giá</h3>
// 				<div className="h-20 w-full">
// 					<div className="flex h-full items-center justify-center gap-5">
// 						<MessagesSquare strokeWidth={1} size={40} />
// 						<span>Hãy là người đầu tiên bình luận trong bài</span>
// 					</div>
// 				</div>

// 				{user && <DanhGiaTextArea banTin={banTin} user={user} currentPathName={currentPathName} />}
// 			</div>
// 		);

// 	return (
// 		<div className="flex flex-col gap-4 pt-4">
// 			<h3 className="text-2xl font-bold">Đánh Giá ({banTin.danhGia.length})</h3>
// 			{user && <DanhGiaTextArea banTin={banTin} user={user} currentPathName={currentPathName} />}

// 			<div className="flex flex-col gap-y-4">
// 				{banTin.danhGia.map((danhGia) => (
// 					<DanhGia
// 						key={`${danhGia.maDanhGia}-${danhGia.maNguoiDung}`}
// 						danhGia={danhGia}
// 						banTin={banTin}
// 						user={user}
// 						currentPathName={currentPathName}
// 						isTraLoi={isTraLoi}
// 						setTrangThaiTraLoi={setTrangThaiTraLoi}
// 					/>
// 				))}
// 			</div>
// 		</div>
// 	);
// };

// const DanhGia = ({
// 	danhGia,
// 	banTin,
// 	user,
// 	currentPathName,
// 	isTraLoi,
// 	setTrangThaiTraLoi,
// }: {
// 	danhGia: ParamsType["banTin"]["danhGia"][number];
// 	banTin: ParamsType["banTin"];
// 	user: User | null;
// 	currentPathName: string;
// 	isTraLoi: string | undefined;
// 	setTrangThaiTraLoi: Dispatch<SetStateAction<string | undefined>>;
// }) => {
// 	return (
// 		<div className="grid grid-cols-[40px_auto] gap-4">
// 			<div className="h-max overflow-hidden rounded-full">
// 				<Image src={danhGia.nguoiDung.anhDaiDien as string} alt="" width={40} height={40} />
// 			</div>

// 			<div className="flex flex-col gap-4">
// 				<div className="flex flex-col gap-2">
// 					<div className="text-lg font-bold">
// 						<span>{danhGia.nguoiDung.tenNguoiDung}</span>
// 					</div>

// 					<div>{danhGia.noiDung}</div>

// 					<div className="flex gap-4">
// 						<button className="flex h-max items-center justify-center gap-2">
// 							<ThumbsUp size={16} /> {danhGia.soLuotThich}
// 						</button>
// 						<button onClick={() => setTrangThaiTraLoi((prev) => (prev !== danhGia.maDanhGia ? danhGia.maDanhGia : undefined))}>
// 							Trả lời
// 						</button>
// 						<span className="h-max">{dayjs(danhGia.ngayDanhGia).fromNow()}</span>
// 					</div>
// 				</div>

// 				{isTraLoi && isTraLoi === danhGia.maDanhGia && (
// 					<div>
// 						<TraLoiDanhGia banTin={banTin} user={user} currentPathName={currentPathName} maTraLoi={danhGia.maDanhGia} />
// 					</div>
// 				)}

// 				{danhGia.traLoiBoi &&
// 					danhGia.traLoiBoi.map((traLoi) => {
// 						return (
// 							<div key={`${traLoi.maDanhGia}-${danhGia.maNguoiDung}`} className="grid grid-cols-[40px_auto] gap-4">
// 								<div className="h-max overflow-hidden rounded-full">
// 									<Image src={traLoi.nguoiDung.anhDaiDien as string} alt="" width={40} height={40} />
// 								</div>

// 								<div className="flex flex-col gap-2">
// 									<div className="text-lg font-bold">
// 										<span>{traLoi.nguoiDung.tenNguoiDung}</span>
// 									</div>

// 									<div>{traLoi.noiDung}</div>

// 									<div className="flex gap-4">
// 										<button className="flex h-max items-center justify-center gap-2">
// 											<ThumbsUp size={16} /> {danhGia.soLuotThich}
// 										</button>

// 										<span className="h-max">{dayjs(danhGia.ngayDanhGia).fromNow()}</span>
// 									</div>
// 								</div>
// 							</div>
// 						);
// 					})}
// 			</div>
// 		</div>
// 	);
// };

// const TraLoiDanhGia = ({ banTin, user, currentPathName, maTraLoi }: ParamsType & { currentPathName: string; maTraLoi: string }) => {
// 	const [isFocus, setFocus] = useState(false);
// 	const formRef = useRef<HTMLFormElement>(null);

// 	const username = useMemo(
// 		() =>
// 			user &&
// 			(user.username
// 				? user.username
// 				: (user.emailAddresses.filter((e) => e.id === user.primaryEmailAddressId)[0]?.emailAddress.split("@")[0] as string)),
// 		[user],
// 	);

// 	return (
// 		<form
// 			ref={formRef}
// 			className="grid w-full gap-4"
// 			id="danhGiaBanTin"
// 			// eslint-disable-next-line @typescript-eslint/no-misused-promises
// 			action={async (data) => {
// 				formRef.current?.reset();
// 				await traLoiDanhGia({
// 					data,
// 					maBanTin: banTin.maBanTin,
// 					maNguoiDung: user?.id,
// 					url: currentPathName,
// 					maDanhGia: maTraLoi,
// 				});
// 			}}
// 		>
// 			<Textarea
// 				onClick={() => (!isFocus ? setFocus(true) : undefined)}
// 				placeholder="Chia sẽ đánh giá của bạn"
// 				name="noiDungDanhGia"
// 				id="noiDungDanhGia"
// 			/>

// 			{isFocus && (
// 				<div className="flex items-center justify-end gap-4">
// 					{user && (
// 						<div className="flex items-center gap-2">
// 							<Image src={user.imageUrl} width={40} height={40} alt={`${user.username}`} className="rounded-full" />
// 							<div> {username} </div>
// 						</div>
// 					)}

// 					<Button type="submit" className="px-8">
// 						Gửi
// 					</Button>
// 				</div>
// 			)}
// 		</form>
// 	);
// };

// const DanhGiaTextArea = ({ banTin, user, currentPathName }: ParamsType & { currentPathName: string }) => {
// 	const [isFocus, setFocus] = useState(false);
// 	const formRef = useRef<HTMLFormElement>(null);

// 	const username = useMemo(
// 		() =>
// 			user &&
// 			(user.username
// 				? user.username
// 				: (user.emailAddresses.filter((e) => e.id === user.primaryEmailAddressId)[0]?.emailAddress.split("@")[0] as string)),
// 		[user],
// 	);

// 	return (
// 		<form
// 			ref={formRef}
// 			className="grid w-full gap-4"
// 			id="danhGiaBanTin"
// 			// eslint-disable-next-line @typescript-eslint/no-misused-promises
// 			action={async (data) => {
// 				formRef.current?.reset();
// 				await danhGiaBanTin({ data, maBanTin: banTin.maBanTin, maNguoiDung: user?.id, url: currentPathName });
// 			}}
// 		>
// 			<Textarea
// 				onClick={() => (!isFocus ? setFocus(true) : undefined)}
// 				placeholder="Chia sẽ đánh giá của bạn"
// 				name="noiDungDanhGia"
// 				id="noiDungDanhGia"
// 			/>

// 			{isFocus && (
// 				<div className="flex items-center justify-end gap-4">
// 					{user && (
// 						<div className="flex items-center gap-2">
// 							<Image src={user.imageUrl} width={40} height={40} alt={`${user.username}`} className="rounded-full" />
// 							<div> {username} </div>
// 						</div>
// 					)}

// 					<Button type="submit" className="px-8">
// 						Gửi
// 					</Button>
// 				</div>
// 			)}
// 		</form>
// 	);
// };
