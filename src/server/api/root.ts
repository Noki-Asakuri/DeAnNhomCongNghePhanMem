import { createTRPCRouter } from "@/server/api/trpc";

import { adminRouter } from "./routers/admin";
import { banTinRouter } from "./routers/banTin";
import { commonRouter } from "./routers/common";
import { danhGiaRouter } from "./routers/danhGia";
import { userRouter } from "./routers/user";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
	banTin: banTinRouter,
	danhGia: danhGiaRouter,
	admin: adminRouter,
	user: userRouter,
	common: commonRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
