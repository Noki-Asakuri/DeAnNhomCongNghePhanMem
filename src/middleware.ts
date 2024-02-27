import { authMiddleware } from "@clerk/nextjs";

export default authMiddleware({
	clockSkewInMs: 1000,
	publicRoutes: [
		"/",
		"/auth/dang-nhap",
		"/auth/dang-ki",
		"/bantin/:path*",
		"/danhmuc/:path*",
		"/api/trpc/:path*",
		"/api/clerk/:path*",
		"/api/test",
	],
});

export const config = {
	matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
