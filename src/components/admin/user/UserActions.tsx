"use client";

import { cn } from "@/utils/common";
import { api } from "@/utils/trpc/react";

import type { userType } from "./UserTable";
import { disAllowedRoles } from "./data";

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

import { Ban, CheckCircle2, MoreVertical, Pencil, XCircle } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";

export const UserActions = ({
	user,
	currentUserId,
	refetch,
}: {
	user: userType;
	currentUserId: string;
	refetch: () => Promise<unknown>;
}) => {
	const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
	const [actionType, setActionType] = useState<"Edit" | "Delete" | "Ban" | "Unban">();

	const userActions = api.admin.updateUser.useMutation({
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
				<DropdownMenu
					itemClasses={{ description: "max-w-[200px]" }}
					disabledKeys={(() => {
						if (user.MaTaiKhoan === currentUserId) return ["Delete", "Ban"];
						if (disAllowedRoles.includes(user.VaiTro)) return ["Delete", "Ban"];
						if (user.Banned) return ["Edit", "Delete"];

						return [];
					})()}
					onAction={(e) => {
						setActionType(e as typeof actionType);
						onOpen();
					}}
				>
					<DropdownSection showDivider title="Hành động">
						<DropdownItem key="Edit" description="Cập nhật thông tin về người dùng" startContent={<Pencil />}>
							Cập nhật
						</DropdownItem>
						{user.Banned ? (
							<DropdownItem
								key={"Unban"}
								description="Xóa cấm người dùng, cho phép người dùng đăng nhập!"
								startContent={<CheckCircle2 />}
							>
								Xóa cấm
							</DropdownItem>
						) : (
							<DropdownItem
								key={"Ban"}
								description="Cấm người dùng đăng nhập, đăng xuất mọi thiết bị của người dùng!"
								startContent={<Ban />}
							>
								Cấm
							</DropdownItem>
						)}
					</DropdownSection>
					<DropdownSection title="Vùng nguy hiểm">
						<DropdownItem
							key="Delete"
							description="Xóa tài khoản người dùng này"
							className="text-danger"
							color="danger"
							startContent={<XCircle />}
						>
							Xóa
						</DropdownItem>
					</DropdownSection>
				</DropdownMenu>
			</Dropdown>

			{actionType && (
				<Modal isOpen={isOpen} onOpenChange={onOpenChange}>
					<ModalContent>
						<form
							onSubmit={(e) => {
								e.preventDefault();

								switch (actionType) {
									case "Ban":
									case "Unban":
									case "Delete": {
										userActions.mutate({
											maTaiKhoan: user.MaTaiKhoan,
											data: { type: actionType },
										});
										break;
									}

									case "Edit": {
										// TODO: Add update
										// userActions.mutate({ maTaiKhoan: user.MaTaiKhoan, data: { type: "Update" } });
										break;
									}
								}
							}}
						>
							<ModalHeader className="flex flex-col gap-1">
								{actionType === "Ban" && `Cấm người dùng "${user.TenTaiKhoan}"`}
								{actionType === "Unban" && `Xóa cấm cho người dùng "${user.TenTaiKhoan}"`}
								{actionType === "Edit" && `Cập nhật người dùng "${user.TenTaiKhoan}"`}
								{actionType === "Delete" && `Xóa người dùng "${user.TenTaiKhoan}"`}
							</ModalHeader>

							<ModalBody>
								{["Ban", "Unban"].includes(actionType) && (
									<p>
										<span className="text-xl text-danger">Lưu ý:</span> Hành động này là{" "}
										<u>
											<b>tạm thời và có thể đảo ngược</b>
										</u>
										, vui lòng cần nhắc trước khi xác nhận hành động này
									</p>
								)}

								{actionType === "Edit" && <></>}

								{actionType === "Delete" && (
									<>
										<p>
											<span className="text-xl text-danger">Lưu ý:</span> Hành động này là{" "}
											<u>
												<b>vĩnh vĩnh và không thể đảo ngược</b>
											</u>
											, vui lòng cần nhắc trước khi xác nhận xóa tài khoản người dùng
										</p>

										{user.VaiTro === "NhanVien" && (
											<p className="font-bold">
												Đây là tài khoản nhân viên, và có{" "}
												<u className="text-danger">{user.NhanVien!._count.BanTin} bản tin</u>, hãy chắc chắn bạn
												muốn xóa nhân viên này!
											</p>
										)}
									</>
								)}
							</ModalBody>

							<ModalFooter>
								<Button
									color={cn<"danger" | "primary">({
										primary: ["Delete", "Ban"].includes(actionType),
										danger: ["Edit", "Unban"].includes(actionType),
									})}
									variant="light"
									onPress={onClose}
								>
									Đóng
								</Button>

								<Button
									type="submit"
									isLoading={userActions.isLoading}
									color={cn<"danger" | "warning">({
										danger: ["Delete", "Ban"].includes(actionType),
										warning: ["Edit", "Unban"].includes(actionType),
									})}
								>
									{actionType === "Ban" && "Cấm"}
									{actionType === "Unban" && "Xóa cấm"}
									{actionType === "Edit" && "Cập nhật"}
									{actionType === "Delete" && "Xóa"}
								</Button>
							</ModalFooter>
						</form>
					</ModalContent>
				</Modal>
			)}
		</div>
	);
};
