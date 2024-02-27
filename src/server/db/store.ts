import { create } from "zustand";
import { persist } from "zustand/middleware";

type States = {
	MaDanhMuc: string;
	TenBanTin: string;
	NoiDung: string;
	NoiDungTomTat: string;
	PreviewImage: string;
};

type Actions = {
	setMaDanhMuc: (id: string) => void;
	setTenBanTin: (title: string) => void;
	setNoiDung: (content: string) => void;
	setNoiDungTomTat: (content: string) => void;
	setPreviewImage: (image: string) => void;
};

export const newStores = create(
	persist<States & Actions>(
		(set) => ({
			MaDanhMuc: "",
			NoiDung: "",
			TenBanTin: "",
			NoiDungTomTat: "",
			PreviewImage: "",

			setMaDanhMuc: (id) => set((state) => ({ ...state, MaDanhMuc: id })),
			setTenBanTin: (title) => set((state) => ({ ...state, TenBanTin: title })),
			setNoiDung: (content) => set((state) => ({ ...state, NoiDung: content })),
			setNoiDungTomTat: (content) => set((state) => ({ ...state, NoiDungTomTat: content })),
			setPreviewImage: (image) => set((state) => ({ ...state, PreviewImage: image })),
		}),
		{
			name: "news-store",
		},
	),
);
