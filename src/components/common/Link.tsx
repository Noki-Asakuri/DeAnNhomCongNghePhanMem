"use client";

import { Link as NextLink } from "@nextui-org/react";
import { type ComponentPropsWithRef, forwardRef } from "react";

export const Link = forwardRef<HTMLAnchorElement, ComponentPropsWithRef<typeof NextLink>>(function Link({ children, ...rest }, ref) {
	return (
		<NextLink {...rest} ref={ref}>
			{children}
		</NextLink>
	);
});
