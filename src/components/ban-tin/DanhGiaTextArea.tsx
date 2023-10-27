"use client";

import { api } from "@/utils/trpc/react";

import type { User as ClerkUser } from "@clerk/clerk-sdk-node";
import { Button, Textarea, User } from "@nextui-org/react";
import { SendHorizontal } from "lucide-react";

import { useState } from "react";
import toast from "react-hot-toast";

type ParamsType = { maBanTin: string; maTraLoi?: string; user: ClerkUser; refetch: () => Promise<void> };

export const DanhGiaTextArea = ({ maBanTin, maTraLoi, user, refetch }: ParamsType) => {
	const [noiDung, setNoiDung] = useState("");

	const danhGia = api.danhGia.danhGiaBanTin.useMutation({
		onSuccess: async () => {
			setNoiDung("");
			await refetch();
		},
		onError: ({ message }) => {
			toast.error("Lỗi: " + message);
		},
	});

	return (
		<div className="flex flex-col gap-2">
			<Textarea
				isInvalid={danhGia.isError}
				label="Đánh giá"
				variant="bordered"
				labelPlacement="outside"
				color={danhGia.isError ? "danger" : "primary"}
				placeholder="Viết cảm nhận của bạn về bản tin này"
				errorMessage={
					danhGia.isError ? (
						<div className="flex items-center justify-between">
							<span>{danhGia.error.message}</span>
							<span>{noiDung.length} ký tự</span>
						</div>
					) : undefined
				}
				value={noiDung}
				description={
					<div className="flex items-center justify-between">
						<span></span>
						<span>{noiDung.length} ký tự</span>
					</div>
				}
				onValueChange={setNoiDung}
				onKeyDown={(e) => {
					if (e.ctrlKey && e.key === "Enter") {
						danhGia.mutate({ maBanTin, noiDung, maTraLoi });
					}
				}}
			/>

			<div className="flex w-full items-center justify-between gap-4">
				{user && <User name={user.username} avatarProps={{ src: user.imageUrl }} />}

				<Button
					isIconOnly
					isLoading={danhGia.isLoading}
					endContent={danhGia.isLoading ? undefined : <SendHorizontal size={20} />}
					color="primary"
					onClick={() => {
						danhGia.mutate({ maBanTin, noiDung, maTraLoi });
					}}
				/>
			</div>
		</div>
	);
};
