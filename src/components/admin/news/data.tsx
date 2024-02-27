import { BookCheck, BookX, CheckCheck, MinusCircle, ThumbsDown, ThumbsUp } from "lucide-react";

export const allNewsAction = [
	// Nhân viên
	"markFinish",
	"markUnfinish",
	"requestApprove",
	// Tổng biên tập
	"approveNew",
	"disapproveNew",
	"cancelRequest",

	//
	"Delete",
	"Copy",
] as const;

type DropdownItemType = { key: (typeof allNewsAction)[number]; color: string; [key: string]: string | JSX.Element }[];

export const NhanVienActionsData = [
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
] as DropdownItemType;

export const TongBienTapActionsData = [
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
] as DropdownItemType;
