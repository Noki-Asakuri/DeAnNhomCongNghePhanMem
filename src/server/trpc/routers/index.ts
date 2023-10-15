import { router } from "../trpc";

import { banTinRouter } from "./banTin";
import { danhGiaRouter } from "./danhGia";

export const appRouter = router({
	banTin: banTinRouter,
	danhGia: danhGiaRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
