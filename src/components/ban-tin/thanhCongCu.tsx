// "use client";

// import { luuBanTin } from "@/server/action/luuBanTin";
// import type { BanTinTable } from "@/server/db/schema/banTin";
// import type { DanhMucTable } from "@/server/db/schema/danhMuc";
// import { getUrl } from "@/utils/path";
// import type { User } from "@clerk/clerk-sdk-node";
// import type { InferModel } from "drizzle-orm";

// import { ArrowLeft, Bookmark, Twitter, Link as LinkIcon, BookMarked } from "lucide-react";

// import Link from "next/link";
// import { usePathname } from "next/navigation";
// import { useState } from "react";
// import { toast } from "react-hot-toast";

// type ParamsType = {
// 	banTin: InferModel<typeof BanTinTable, "select"> & { danhMuc: InferModel<typeof DanhMucTable, "select"> | null };
// 	user: User | null;
// };

// export const ThanhCongCu = ({ banTin, host, user, daLuu }: ParamsType & { host: string; daLuu: boolean }) => {
// 	const tweetUrl = new URL("https://twitter.com/intent/tweet");
// 	const currentPath = usePathname();

// 	const [isBookmarked, setBookmark] = useState(daLuu);

// 	tweetUrl.searchParams.set("text", banTin.TenBanTin);
// 	tweetUrl.searchParams.set("url", getUrl(host, currentPath));

// 	return (
// 		<div className="flex items-center justify-between pt-4">
// 			<div className="flex gap-4">
// 				<Link href={`/danhMuc/${banTin.danhMuc?.tenDanhMuc}`} className="rounded-lg border border-[#262626] p-2">
// 					<ArrowLeft />
// 				</Link>

// 				{user && (
// 					<form
// 						// eslint-disable-next-line @typescript-eslint/no-misused-promises
// 						action={async () => {
// 							if (isBookmarked) return;
// 							await luuBanTin({ maBanTin: banTin.maBanTin, maNguoiDung: user?.id });

// 							setBookmark(true);
// 						}}
// 					>
// 						<button type="submit" className="flex items-center gap-2 rounded-lg border border-[#262626] p-2">
// 							{isBookmarked && (
// 								<>
// 									<BookMarked size={20} /> Đã lưu
// 								</>
// 							)}

// 							{!isBookmarked && (
// 								<>
// 									<Bookmark size={20} /> Lưu bản tin
// 								</>
// 							)}
// 						</button>
// 					</form>
// 				)}
// 			</div>

// 			<div className="flex items-center gap-4">
// 				<span> Chia sẽ: </span>

// 				<Link
// 					className="gap-2 rounded-full border border-[#262626] p-2 hover:cursor-pointer"
// 					href={tweetUrl.toString()}
// 					target="_blank"
// 					title="Chia sẽ bản tin này lên X"
// 				>
// 					<Twitter size={20} />
// 				</Link>

// 				<button
// 					className="rounded-full border border-[#262626]/60 p-2"
// 					title="Sao chép đường dẫn của bản tin này"
// 					// eslint-disable-next-line @typescript-eslint/no-misused-promises
// 					onClick={async () => {
// 						await window.navigator.clipboard.writeText(getUrl(host, currentPath));
// 						toast.success("Sao chép đường đẫn thành công");
// 					}}
// 				>
// 					<LinkIcon size={20} />
// 				</button>
// 			</div>
// 		</div>
// 	);
// };
