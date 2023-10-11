"use client";

import type { ReactNode } from "react";
import { NextUIProvider } from "@nextui-org/react";
import { ThemeProvider as NextThemesProvider } from "next-themes";

const MainLayout = ({ children }: { children: ReactNode }) => {
	return (
		<NextUIProvider className="flex min-h-screen flex-col">
			<NextThemesProvider attribute="class" defaultTheme="dark">
				{children}
			</NextThemesProvider>
		</NextUIProvider>
	);
};
export { MainLayout };
