"use client";

import { cn } from "@/utils/common";
import { api } from "@/utils/trpc/react";

import {
	Button,
	Dropdown,
	DropdownItem,
	DropdownMenu,
	DropdownSection,
	DropdownTrigger,
	Input,
	Modal,
	ModalBody,
	ModalContent,
	ModalFooter,
	ModalHeader,
	Select,
	SelectItem,
	useDisclosure,
} from "@nextui-org/react";
import type { DanhMuc } from "@prisma/client";

import { Pencil, PlusCircle, Settings2, XCircle } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";

export const CategoriesActions = ({ refetch, categories }: { refetch: () => Promise<unknown>; categories: DanhMuc[] }) => {
	const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();

	const [actionType, setActionType] = useState<"Add" | "Edit" | "Delete">();
	const [tenDanhMuc, setTenDanhMuc] = useState("");
	const [selectedMaDanhMuc, setMaDanhMuc] = useState<string>();

	const updateCategory = api.admin.updateCategory.useMutation({
		onSuccess: async () => {
			await refetch();
			onClose();

			setTenDanhMuc("");
			setMaDanhMuc(undefined);
		},
		onError: ({ message }) => {
			toast.error("Lỗi: " + message);
		},
	});

	return (
		<>
			<Dropdown showArrow>
				<DropdownTrigger>
					<Button
						size="lg"
						isIconOnly
						startContent={<Settings2 />}
						className="h-full flex-shrink-0 rounded-l-none aria-[expanded=true]:scale-100"
					/>
				</DropdownTrigger>
				<DropdownMenu
					aria-label="Categories Actions"
					onAction={(e) => {
						setActionType(e as typeof actionType);
						onOpen();
					}}
				>
					<DropdownSection showDivider title="Hành động">
						<DropdownItem key="Add" description="Thêm danh mục" startContent={<PlusCircle />}>
							Thêm
						</DropdownItem>

						<DropdownItem key="Edit" description="Chỉnh sửa tên 1 danh mục" startContent={<Pencil />}>
							Chỉnh sửa
						</DropdownItem>
					</DropdownSection>
					<DropdownSection title={"Vùng nguy hiểm"}>
						<DropdownItem
							key="Delete"
							className="text-danger"
							color="danger"
							description="Xóa 1 danh mục"
							startContent={<XCircle />}
						>
							Xóa
						</DropdownItem>
					</DropdownSection>
				</DropdownMenu>
			</Dropdown>

			{actionType && (
				<Modal
					isOpen={isOpen}
					onOpenChange={onOpenChange}
					onClose={() => {
						setTenDanhMuc("");
						setMaDanhMuc(undefined);
					}}
				>
					<ModalContent>
						<form
							onSubmit={(e) => {
								e.preventDefault();

								if (actionType === "Add")
									updateCategory.mutate({
										TenDanhMuc: tenDanhMuc,
										type: actionType,
									});
								else if (actionType === "Edit" && selectedMaDanhMuc)
									updateCategory.mutate({
										MaDanhMuc: selectedMaDanhMuc,
										TenDanhMuc: tenDanhMuc,
										type: actionType,
									});
								else if (actionType === "Delete" && selectedMaDanhMuc)
									updateCategory.mutate({
										MaDanhMuc: selectedMaDanhMuc,
										type: actionType,
									});
							}}
						>
							<ModalHeader className="flex flex-col gap-1">
								{actionType === "Add" && "Thêm danh mục"}
								{actionType === "Edit" && "Sửa tên danh mục"}
								{actionType === "Delete" && "Xóa danh mục"}
							</ModalHeader>

							<ModalBody>
								{actionType === "Add" && (
									<Input
										label="Tên danh mục"
										labelPlacement="outside"
										placeholder="Tên danh mục mà bạn muốn tạo"
										isInvalid={updateCategory.isError}
										errorMessage={updateCategory.error?.message}
										value={tenDanhMuc}
										onValueChange={setTenDanhMuc}
									/>
								)}

								{actionType === "Edit" && (
									<>
										<Select
											items={categories}
											label="Danh mục"
											labelPlacement="outside"
											placeholder="Chọn danh mục bạn muốn sửa tên"
											onChange={(e) => {
												setMaDanhMuc(e.target.value);
												setTenDanhMuc(
													categories.find((category) => category.MaDanhMuc === e.target.value)!.TenDanhMuc,
												);
											}}
										>
											{(category) => <SelectItem key={category.MaDanhMuc}>{category.TenDanhMuc}</SelectItem>}
										</Select>

										<Input
											label="Tên danh mục"
											labelPlacement="outside"
											placeholder="Tên mới cho danh mục"
											isInvalid={updateCategory.isError}
											errorMessage={updateCategory.error?.message}
											value={tenDanhMuc}
											onValueChange={setTenDanhMuc}
										/>
									</>
								)}

								{actionType === "Delete" && (
									<>
										<p>
											<span className="text-xl text-danger-600">Lưu ý:</span> Đây là 1 hành động không để đảo ngược,
											vui lòng xem xét kỹ trước khi xác nhận xóa!
										</p>

										<Select
											items={categories}
											label="Danh mục"
											labelPlacement="outside"
											placeholder="Chọn danh mục bạn muốn sửa xóa"
											onChange={(e) => setMaDanhMuc(e.target.value)}
										>
											{(category) => <SelectItem key={category.MaDanhMuc}>{category.TenDanhMuc}</SelectItem>}
										</Select>
									</>
								)}
							</ModalBody>

							<ModalFooter>
								<Button color="danger" variant="light" onPress={onClose}>
									Đóng
								</Button>

								<Button
									type="submit"
									isLoading={updateCategory.isLoading}
									color={cn<"primary" | "warning" | "danger">({
										danger: actionType === "Delete",
										warning: actionType === "Edit",
										primary: actionType === "Add",
									})}
								>
									{actionType === "Add" && "Thêm"}
									{actionType === "Edit" && "Sửa"}
									{actionType === "Delete" && "Xóa"}
								</Button>
							</ModalFooter>
						</form>
					</ModalContent>
				</Modal>
			)}
		</>
	);
};
