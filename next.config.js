import createJiti from "jiti";
import { fileURLToPath } from "node:url";

const jiti = createJiti(fileURLToPath(import.meta.url));

jiti("./src/env.ts");

/** @type {import("next").NextConfig} */
const config = {
	reactStrictMode: true,
	eslint: { ignoreDuringBuilds: true },
	images: {
		domains: [
			"images.clerk.dev",
			"img.clerk.com",

			"i1-vnexpress.vnecdn.net",
			"i1-kinhdoanh.vnecdn.net",
			"i1-thethao.vnecdn.net",
			"i1-dulich.vnecdn.net",
			"i1-suckhoe.vnecdn.net",
			"i1-giadinh.vnecdn.net",
			"i1-giaitri.vnecdn.net",
			"i1-sohoa.vnecdn.net",
		],
	},
};
export default config;

