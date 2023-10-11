"use client";

import { useUser, UserProfile } from "@clerk/nextjs";
import { dark } from "@clerk/themes";

import { Spinner } from "@nextui-org/react";
import { useTheme } from "next-themes";

export default function UserProfilePage() {
	const { isLoaded } = useUser();
	const { theme } = useTheme();

	return (
		<div className="flex h-full w-full items-start justify-center">
			{!isLoaded ? (
				<div className="flex h-full w-full flex-1 items-center justify-center">
					<Spinner label="Loading..." color="primary" />
				</div>
			) : (
				<UserProfile
					appearance={{
						baseTheme: theme === "dark" ? dark : undefined,
						elements: {
							rootBox: { width: "100%" },
							card: { margin: 0 },
							navbar: { padding: "1.5rem 1rem" },
							pageScrollBox: { padding: "1.5rem 1rem" },
						},
					}}
				/>
			)}
		</div>
	);
}
