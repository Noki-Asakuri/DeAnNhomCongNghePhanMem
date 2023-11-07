"use client";

import { api } from "@/utils/trpc/react";
import type { RouterOutputs } from "@/utils/trpc/shared";

import type { newType } from "./NewsTable";
import { allNewsAction } from "./data";

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

import { BookCheck, BookX, CheckCheck, MinusCircle, MoreVertical, ThumbsDown, ThumbsUp, XCircle } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";

export const NewActions = ({
	banTin,
	currentUserId,
	user,
	refetch,
}: {
	banTin: newType;
	currentUserId: string;
	user: NonNullable<RouterOutputs["admin"]["getCurrentUser"]>;
	refetch: () => Promise<unknown>;
}) => {
	const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
	const [actionType, setActionType] = useState<(typeof allNewsAction)[number]>();

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

				{user.VaiTro === "NhanVien" && (
					<NhanVienDropdown banTin={banTin} currentUserId={currentUserId} onOpen={onOpen} setActionType={setActionType} />
				)}

				{(user.VaiTro === "TongBienTap" || user.VaiTro === "QuanTriVien") && (
					<TongBienTapDropdown banTin={banTin} currentUserId={currentUserId} onOpen={onOpen} setActionType={setActionType} />
				)}
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

const TongBienTapDropdown = ({
	banTin,
	onOpen,
	setActionType,
}: {
	banTin: newType;
	currentUserId: string;
	onOpen: () => void;
	setActionType: (e: (typeof allNewsAction)[number]) => void;
}) => {
	return (
		<DropdownMenu
			itemClasses={{ description: "max-w-[200px]" }}
			disabledKeys={(() => {
				if (banTin.TrangThai === "APPROVED") return ["approveNew", "disapproveNew"];
				if (banTin.TrangThai === "UNAPPROVED") return ["approveNew", "disapproveNew"];
				if (banTin.TrangThai === "WAITING") return ["cancelRequest"];

				return ["approveNew", "disapproveNew", "cancelRequest"];
			})()}
			onAction={(e) => {
				setActionType(e as (typeof allNewsAction)[number]);
				onOpen();
			}}
		>
			<DropdownSection
				showDivider
				title="Chấp thuận"
				items={
					[
						{
							key: "approveNew",
							value: "Chấp thuận bản tin",
							description: "Xác nhận bản tin đã được chấp thuận",
							icon: <ThumbsUp />,
							color: "text-success",
						},
						{
							key: "disapproveNew",
							value: "Không chấp thuận bản tin",
							description: "Đánh đấu bản tin không được chấp thuận",
							icon: <ThumbsDown />,
							color: "text-warning",
						},
						{
							key: "cancelRequest",
							value: "Hủy bỏ yêu cầu chấp thuận",
							description: "Hủy bỏ trạng thái chấp thuận hay từ chối chấp thuận của bản tin",
							icon: <MinusCircle />,
							color: "text-danger",
						},
					] satisfies { key: (typeof allNewsAction)[number]; [key: string]: string | JSX.Element }[]
				}
			>
				{/* @ts-expect-error Typescript error, but still render correctly */}
				{(item) => (
					<DropdownItem key={item.key} startContent={item.icon} description={item.description} className={item.color}>
						{item.value}
					</DropdownItem>
				)}
			</DropdownSection>

			<DropdownSection title="Vùng nguy hiểm">
				<DropdownItem key="Delete" description="Xóa bản tin này" className="text-danger" color="danger" startContent={<XCircle />}>
					Xóa
				</DropdownItem>
			</DropdownSection>
		</DropdownMenu>
	);
};

const NhanVienDropdown = ({
	banTin,
	currentUserId,
	onOpen,
	setActionType,
}: {
	banTin: newType;
	currentUserId: string;
	onOpen: () => void;
	setActionType: (e: (typeof allNewsAction)[number]) => void;
}) => {
	return (
		<DropdownMenu
			itemClasses={{ description: "max-w-[200px]" }}
			disabledKeys={(() => {
				if (banTin.MaNhanVien !== currentUserId) return ["markFinish", "markUnfinish", "requestApprove"];

				if (banTin.TrangThai === "FINISHED") return ["markFinish"];
				if (banTin.TrangThai === "WAITING") return ["markFinish", "requestApprove"];
				if (banTin.TrangThai === "UNFINISHED") return ["markUnfinish", "requestApprove"];

				return [];
			})()}
			onAction={(e) => {
				setActionType(e as (typeof allNewsAction)[number]);
				onOpen();
			}}
		>
			<DropdownSection
				showDivider
				title="Hành động"
				items={
					[
						{
							key: "markFinish",
							value: "Đánh đấu hoàn thành",
							description: "Đánh dấu bản tin đã hoàn thành",
							icon: <BookCheck />,
							color: "text-primary",
						},
						{
							key: "markUnfinish",
							value: "Đánh dấu chưa hoàn thành",
							description: "Đánh đấu bản tin chưa hoàn thành",
							icon: <BookX />,
							color: "text-warning",
						},
						{
							key: "requestApprove",
							value: "Yêu cầu xét duyệt",
							description: "Xác nhận bản tin có thể được duyệt",
							icon: <CheckCheck />,
							color: "text-success",
						},
					] satisfies { key: (typeof allNewsAction)[number]; [key: string]: string | JSX.Element }[]
				}
			>
				{/* @ts-expect-error Typescript error, but still render correctly */}
				{(item) => (
					<DropdownItem key={item.key} startContent={item.icon} description={item.description} className={item.color}>
						{item.value}
					</DropdownItem>
				)}
			</DropdownSection>

			<DropdownSection title="Vùng nguy hiểm">
				<DropdownItem key="Delete" description="Xóa bản tin này" className="text-danger" color="danger" startContent={<XCircle />}>
					Xóa
				</DropdownItem>
			</DropdownSection>
		</DropdownMenu>
	);
};
