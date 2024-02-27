"use client";

import { newStores } from "@/server/db/store";
import { api } from "@/utils/trpc/react";
import type { RouterOutputs } from "@/utils/trpc/shared";

import Link from "next/link";

import { Button, ButtonGroup, Divider, Input, Select, SelectItem, Textarea } from "@nextui-org/react";

import toast from "react-hot-toast";
import { useStore } from "zustand";

const CreatePage = ({ categories }: { categories: RouterOutputs["common"]["getCategories"] }) => {
	const state = useStore(newStores, (state) => state);

	const createNews = api.admin.createNews.useMutation({
		onError: ({ message }) => toast.error("Lỗi: " + message),
	});

	return (
		<>
			<section className="flex items-center justify-center gap-2">
				<Input
					isRequired
					value={state.TenBanTin}
					label="Tên Bản Tin"
					labelPlacement="outside"
					placeholder="Nhập tên bản tin"
					onValueChange={state.setTenBanTin}
				/>

				<Select
					isRequired
					label="Danh mục"
					items={categories}
					disallowEmptySelection
					labelPlacement="outside"
					classNames={{ base: "w-1/3" }}
					defaultSelectedKeys={[state.MaDanhMuc]}
					onChange={(event) => state.setMaDanhMuc(event.target.value)}
				>
					{(item) => <SelectItem key={item.MaDanhMuc}>{item.TenDanhMuc}</SelectItem>}
				</Select>
			</section>

			<Divider orientation="horizontal" />

			<section className="flex flex-grow flex-col items-center gap-4">
				<Input
					label="Ảnh nền"
					placeholder="Nhập url ảnh nền"
					labelPlacement="outside"
					value={state.PreviewImage}
					onValueChange={state.setPreviewImage}
				/>

				<Textarea
					label="Nội dung tóm tắt"
					labelPlacement="outside"
					value={state.NoiDungTomTat}
					onValueChange={state.setNoiDungTomTat}
					classNames={{ input: "resize-y" }}
				/>

				<Textarea
					label="Nội dung"
					labelPlacement="outside"
					value={state.NoiDung}
					onValueChange={state.setNoiDung}
					classNames={{ input: "resize-y" }}
				/>
			</section>

			<ButtonGroup fullWidth>
				<Button color="primary" as={Link} href="/admin/manage/news/preview">
					Xem nháp bản tin
				</Button>
				<Button color="success" onPress={() => createNews.mutate(state)} isLoading={createNews.isLoading}>
					Thêm bản tin
				</Button>
			</ButtonGroup>
		</>
	);
};

export default CreatePage;
