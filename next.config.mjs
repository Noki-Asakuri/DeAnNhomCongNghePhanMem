/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
await import("./src/env.mjs");

/** @type {import("next").NextConfig} */
const config = {
	reactStrictMode: true,
	experimental: { serverActions: true },

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

	/**
	 * If you have `experimental: { appDir: true }` set, then you must comment the below `i18n` config
	 * out.
	 *
	 * @see https://github.com/vercel/next.js/issues/41980
	 
	i18n: {
		locales: ["en"],
		defaultLocale: "en",
	},
	*/
};
export default config;

