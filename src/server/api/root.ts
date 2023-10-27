import { createTRPCRouter } from "@/server/api/trpc";

import { banTinRouter } from "./routers/banTin";
import { danhGiaRouter } from "./routers/danhGia";
import { thongBaoRouter } from "./routers/thongBao";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
	banTin: banTinRouter,
	danhGia: danhGiaRouter,
	thongBao: thongBaoRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
