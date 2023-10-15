import { authMiddleware } from "@clerk/nextjs";

export default authMiddleware({
	publicRoutes: ["/", "/auth/dang-nhap", "/auth/dang-ki", "/bantin/:path*", "/danhmuc/:path*", "/api/trpc/:path*", "/api/clerk/:path*"],
});

export const config = {
	matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
