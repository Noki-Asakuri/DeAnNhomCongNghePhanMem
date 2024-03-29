import { getBaseUrl } from "./trpc/shared";

export const encodeBanTinPath = (banTin: { MaBanTin: string; TenBanTin: string }) => {
	const [tenBanTin, maBanTin] = [banTin.TenBanTin.replace(/ /g, "-"), banTin.MaBanTin.replace(/\-/g, "")];

	return `/bantin/${`${encodeURIComponent(tenBanTin)}-${maBanTin}`}`;
};

export const decodeBanTinPath = (tenBanTin_maBanTin: string) => {
	const decodedPath = decodeURIComponent(tenBanTin_maBanTin);

	const [tenBanTin, maBanTin] = [
		decodedPath.slice(0, -33).replace(/\-/g, " "),
		decodedPath.slice(-32).replace(/(\w{8})(\w{4})(\w{4})(\w{4})(\w{12})/, "$1-$2-$3-$4-$5"),
	];

	return { tenBanTin, maBanTin };
};

export const getUrl = (path: string) => {
	return getBaseUrl(true) + decodeURIComponent(path);
};
