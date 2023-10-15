// src/server/router/context.ts
import { getAuth } from "@clerk/nextjs/server";

import type { inferAsyncReturnType } from "@trpc/server";
import type { NextRequest } from "next/server";

import { prisma } from "@/server/db/prisma";

/**
 * This is the actual context you'll use in your router
 * @link https://trpc.io/docs/context
 **/
export const createContext = ({ req }: { req: NextRequest }) => {
	const { userId } = getAuth(req);

	return { prisma, userId };
};

export type Context = inferAsyncReturnType<typeof createContext>;
