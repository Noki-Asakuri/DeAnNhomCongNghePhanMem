"use client";

import { trpc } from "@/utils/trpc/client";

import type { User as ClerkUser } from "@clerk/clerk-sdk-node";
import { Button, Textarea, User } from "@nextui-org/react";
import { SendHorizontal } from "lucide-react";

import { useState } from "react";
import toast from "react-hot-toast";

type ParamsType = { maBanTin: string; maTraLoi?: string; user: ClerkUser; refetch: () => Promise<void> };

export const DanhGiaTextArea = ({ maBanTin, maTraLoi, user, refetch }: ParamsType) => {
	const [isClicked, setClicked] = useState(false);
	const [noiDung, setNoiDung] = useState("");

	const danhGia = trpc.danhGia.danhGiaBanTin.useMutation({
		onSuccess: async () => {
			setClicked(false);
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
				errorMessage={danhGia.isError ? danhGia.error.message : undefined}
				maxRows={isClicked ? undefined : 1}
				value={noiDung}
				onValueChange={setNoiDung}
				onClick={() => setClicked(true)}
			/>

			{isClicked && (
				<div className="flex w-full items-center justify-end gap-4">
					<User name={user.username} avatarProps={{ src: user.imageUrl }} />

					<Button
						isIconOnly
						isLoading={danhGia.isLoading}
						endContent={danhGia.isLoading ? undefined : <SendHorizontal size={20} />}
						color="primary"
						onClick={() => {
							danhGia.mutate({ maBanTin, noiDung, maNguoiDung: user.id, maTraLoi });
						}}
					/>
				</div>
			)}
		</div>
	);
};
