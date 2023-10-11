"use client";

import { Divider as NextDivider } from "@nextui-org/react";
import { type ComponentProps, forwardRef } from "react";

export const Divider = forwardRef<HTMLHRElement, ComponentProps<typeof NextDivider>>(function Divider({ children, ...rest }, ref) {
	return (
		<NextDivider {...rest} ref={ref}>
			{children}
		</NextDivider>
	);
});
