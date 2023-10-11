import { type Config } from "tailwindcss";

import { nextui } from "@nextui-org/react";

export default {
	darkMode: ["class"],
	content: ["./src/**/*.{js,ts,jsx,tsx}", "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}"],
	theme: {
		container: {
			center: true,
			padding: "1.5rem",
			screens: { "2xl": "1400px" },
		},
	},
	plugins: [require("tailwindcss-animate"), nextui()],
} satisfies Config;

