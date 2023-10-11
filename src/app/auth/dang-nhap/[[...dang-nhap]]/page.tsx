"use client";

import { SignIn } from "@clerk/nextjs";
import { dark } from "@clerk/themes";

import { useTheme } from "next-themes";

export default function SignInPage() {
	const { theme } = useTheme();

	return (
		<div className="container mx-auto flex flex-1 items-center justify-center py-5">
			<SignIn appearance={{ baseTheme: theme === "dark" ? dark : undefined }} />
		</div>
	);
}
