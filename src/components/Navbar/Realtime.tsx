"use client";

import { useMemo } from "react";

const timeFormatter = new Intl.DateTimeFormat("vi", { dateStyle: "long" });

export const RealTime = () => {
	const currentDate = useMemo(() => timeFormatter.format(Date.now()), []);

	return <span className="w-max text-sm"> {currentDate} </span>;
};
