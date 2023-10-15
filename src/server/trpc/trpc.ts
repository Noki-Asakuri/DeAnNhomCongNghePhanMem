import { TRPCError, initTRPC, type inferRouterInputs, type inferRouterOutputs } from "@trpc/server";
import superjson from "superjson";

import type { Context } from "./context";
import type { AppRouter } from "./routers";

export const t = initTRPC.context<Context>().create({
	transformer: superjson,
	errorFormatter: ({ shape }) => shape,
});

const isAuthed = t.middleware(({ next, ctx }) => {
	if (!ctx.userId) {
		throw new TRPCError({ code: "UNAUTHORIZED", message: "Bạn cần đăng nhập để tiếp tục." });
	}
	return next({ ctx: { ...ctx, userId: ctx.userId } });
});

export const router = t.router;
export const publicProcedure = t.procedure;
export const authProcedure = t.procedure.use(isAuthed);

export type RouterInput = inferRouterInputs<AppRouter>;
export type RouterOutput = inferRouterOutputs<AppRouter>;
