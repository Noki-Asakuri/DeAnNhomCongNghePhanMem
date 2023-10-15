"use client";

import { Image as NextImage } from "@nextui-org/react";
import { type ComponentPropsWithRef, forwardRef } from "react";

export const Image = forwardRef<HTMLImageElement, ComponentPropsWithRef<typeof NextImage>>(function Image({ children, ...rest }, ref) {
	return (
		<NextImage {...rest} ref={ref}>
			{children}
		</NextImage>
	);
});
