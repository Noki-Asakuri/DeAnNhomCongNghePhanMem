"use client";

import type { ReactNode } from "react";
import { NextUIProvider } from "@nextui-org/react";
import { ThemeProvider as NextThemesProvider } from "next-themes";

import { TRPCReactProvider } from "@/utils/trpc/react";

const MainLayout = ({ children, headers }: { children: ReactNode; headers: Headers }) => {
	return (
		<NextUIProvider className="flex min-h-screen flex-col">
			<NextThemesProvider attribute="class" defaultTheme="dark">
				<TRPCReactProvider headers={headers}>{children}</TRPCReactProvider>
			</NextThemesProvider>
		</NextUIProvider>
	);
};

export { MainLayout };
