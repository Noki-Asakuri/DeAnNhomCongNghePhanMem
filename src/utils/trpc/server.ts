import { httpBatchLink } from "@trpc/client";

import { appRouter } from "@/server/trpc/routers";
import { getBaseUrl } from "@/utils/getbaseUrl";

import { prisma } from "@/server/db/prisma";

export const serverClient = appRouter.createCaller({
	// @ts-expect-error No idea
	links: [httpBatchLink({ url: getBaseUrl() + "/api/trpc" })],
	prisma,
});
