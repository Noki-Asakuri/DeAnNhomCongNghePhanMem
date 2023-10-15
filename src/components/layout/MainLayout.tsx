"use client";

import type { ReactNode } from "react";
import { NextUIProvider } from "@nextui-org/react";
import { ThemeProvider as NextThemesProvider } from "next-themes";

import TRPCProvider from "@/utils/trpc/Provider";

const MainLayout = ({ children }: { children: ReactNode }) => {
	return (
		<NextUIProvider className="flex min-h-screen flex-col">
			<NextThemesProvider attribute="class" defaultTheme="dark">
				<TRPCProvider>{children}</TRPCProvider>
			</NextThemesProvider>
		</NextUIProvider>
	);
};
export { MainLayout };
