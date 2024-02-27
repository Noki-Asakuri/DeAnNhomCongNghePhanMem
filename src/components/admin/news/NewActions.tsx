"use client";

import { encodeBanTinPath, getUrl } from "@/utils/path";
import { api } from "@/utils/trpc/react";
import type { RouterOutputs } from "@/utils/trpc/shared";

import type { newType } from "./NewsTable";
import { NhanVienActionsData, TongBienTapActionsData, type allNewsAction } from "./data";

import {
	Button,
	Dropdown,
	DropdownItem,
	DropdownMenu,
	DropdownSection,
	DropdownTrigger,
	Modal,
	ModalBody,
	ModalContent,
	ModalFooter,
	ModalHeader,
	useDisclosure,
} from "@nextui-org/react";

import { Copy, MoreVertical, XCircle } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";

export const NewActions = ({
	banTin,
	user,
	refetch,
}: {
	banTin: newType;
	user: NonNullable<RouterOutputs["admin"]["getCurrentUser"]>;
	refetch: () => Promise<unknown>;
}) => {
	const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
	const [actionType, setActionType] = useState<Exclude<(typeof allNewsAction)[number], "Copy">>();

	const updateNew = api.admin.updateNews.useMutation({
		onSuccess: async () => {
			await refetch();
			onClose();

			setActionType(undefined);
		},
		onError: ({ message }) => toast.error("Lỗi: " + message),
	});

	return (
		<div className="relative flex items-center justify-end gap-2">
			<Dropdown showArrow>
				<DropdownTrigger>
					<Button isIconOnly variant="light" startContent={<MoreVertical size={16} />} />
				</DropdownTrigger>

				<DropdownActions banTin={banTin} user={user} onOpen={onOpen} setActionType={setActionType} />
			</Dropdown>

			{actionType && (
				<Modal isOpen={isOpen} onOpenChange={onOpenChange}>
					<ModalContent>
						<form
							onSubmit={(e) => {
								e.preventDefault();

								updateNew.mutate({
									maBanTin: banTin.MaBanTin,
									type: actionType,
								});
							}}
						>
							<ModalHeader className="flex flex-col gap-1"></ModalHeader>

							<ModalBody></ModalBody>

							<ModalFooter>
								<Button variant="light" onPress={onClose}>
									Đóng
								</Button>

								<Button type="submit" isLoading={updateNew.isLoading}>
									Xác nhận
								</Button>
							</ModalFooter>
						</form>
					</ModalContent>
				</Modal>
			)}
		</div>
	);
};

type DropdownPropsType = {
	banTin: newType;
	user: NonNullable<RouterOutputs["admin"]["getCurrentUser"]>;
	onOpen: () => void;
	setActionType: (e: Exclude<(typeof allNewsAction)[number], "Copy">) => void;
};

const DropdownActions = ({ banTin, user, onOpen, setActionType }: DropdownPropsType) => {
	return (
		<DropdownMenu
			itemClasses={{ description: "max-w-[200px]" }}
			disabledKeys={(() => {
				if (user.VaiTro === "NhanVien" || user.VaiTro === "QuanTriVien") {
					if (banTin.MaNhanVien !== user.MaTaiKhoan && user.VaiTro === "NhanVien") {
						return ["markFinish", "markUnfinish", "requestApprove"];
					}

					if (banTin.TrangThai === "FINISHED") return ["markFinish"];
					if (banTin.TrangThai === "WAITING") return ["markFinish", "requestApprove"];
					if (banTin.TrangThai === "UNFINISHED") return ["markUnfinish", "requestApprove"];
				}

				if (user.VaiTro === "TongBienTap" || user.VaiTro === "QuanTriVien") {
					if (banTin.TrangThai === "APPROVED") return ["approveNew", "disapproveNew"];
					if (banTin.TrangThai === "UNAPPROVED") return ["approveNew", "disapproveNew"];
					if (banTin.TrangThai === "WAITING") return ["cancelRequest"];

					return ["approveNew", "disapproveNew", "cancelRequest"];
				}

				return ["approveNew", "disapproveNew", "cancelRequest"];
			})()}
			onAction={(key) => {
				const actionType = key as (typeof allNewsAction)[number];

				if (actionType === "Copy") {
					const duongDanBanTin = encodeBanTinPath(banTin);

					// eslint-disable-next-line @typescript-eslint/no-floating-promises
					window.navigator.clipboard
						.writeText(getUrl(duongDanBanTin))
						.then(() => {
							toast.success("Copy đường dẫn thành công!");
						})
						.catch(() => {
							toast.error("Sao chép đường đẫn thất bại");
						});
				}
			}}
		>
			<DropdownSection showDivider title="Hành động">
				<DropdownItem key="Copy" description="Sao chép đường dẫn của bản tin này" startContent={<Copy />}>
					Sao chép đường dẫn
				</DropdownItem>
			</DropdownSection>

			{user.VaiTro === "TongBienTap" || user.VaiTro === "QuanTriVien" ? (
				<DropdownSection showDivider title="Tổng biên tập" items={TongBienTapActionsData}>
					{/* @ts-expect-error Typescript error, but still render correctly */}
					{(item) => (
						<DropdownItem key={item.key} startContent={item.icon} description={item.description} className={item.color}>
							{item.value}
						</DropdownItem>
					)}
				</DropdownSection>
			) : (
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
				(undefined as any)
			)}

			{user.VaiTro === "NhanVien" || user.VaiTro === "QuanTriVien" ? (
				<DropdownSection showDivider title="Nhân viên" items={NhanVienActionsData}>
					{/* @ts-expect-error Typescript error, but still render correctly */}
					{(item) => (
						<DropdownItem key={item.key} startContent={item.icon} description={item.description} className={item.color}>
							{item.value}
						</DropdownItem>
					)}
				</DropdownSection>
			) : (
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
				(undefined as any)
			)}

			<DropdownSection title="Vùng nguy hiểm">
				<DropdownItem key="Delete" description="Xóa bản tin này" className="text-danger" color="danger" startContent={<XCircle />}>
					Xóa
				</DropdownItem>
			</DropdownSection>
		</DropdownMenu>
	);
};
