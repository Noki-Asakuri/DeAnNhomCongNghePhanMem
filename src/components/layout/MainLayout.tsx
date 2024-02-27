"use client";

import { TRPCReactProvider } from "@/utils/trpc/react";

import { ThemeProvider as NextThemesProvider } from "next-themes";

import { NextUIProvider } from "@nextui-org/react";

import type { ReactNode } from "react";

const MainLayout = ({ children, headers }: { children: ReactNode; headers: Headers }) => {
	return (
		<NextUIProvider className="flex min-h-screen flex-col">
			<NextThemesProvider attribute="class" defaultTheme="dark">
				<TRPCReactProvider>{children}</TRPCReactProvider>
			</NextThemesProvider>
		</NextUIProvider>
	);
};

export { MainLayout };

