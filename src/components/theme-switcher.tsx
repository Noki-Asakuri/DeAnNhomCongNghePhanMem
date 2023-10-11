"use client";

import { Button } from "@nextui-org/react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

import { MoonIcon, SunIcon } from "lucide-react";

export const ThemeSwitcher = () => {
	const [mounted, setMounted] = useState(false);
	const { theme, setTheme } = useTheme();

	useEffect(() => {
		setMounted(true);
	}, []);

	if (!mounted) return null;

	return (
		<Button onClick={() => setTheme(theme === "dark" ? "light" : "dark")} isIconOnly className="transition-all">
			{theme === "dark" ? <MoonIcon /> : <SunIcon />}
		</Button>
	);
};
