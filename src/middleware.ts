import { authMiddleware } from "@clerk/nextjs";

export default authMiddleware({
	publicRoutes: ["/", "/auth/dang-nhap", "/auth/dang-ki", "/bantin/:path", "/danhmuc/:path"],
	ignoredRoutes: ["/api/clerk/event/:path", "/api/test/:path"],
});

export const config = {
	matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
