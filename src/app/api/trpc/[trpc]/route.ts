import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import type { NextRequest } from "next/server";

import { createContext } from "@/server/trpc/context";
import { appRouter } from "@/server/trpc/routers";

const handler = (req: NextRequest) =>
	fetchRequestHandler({
		endpoint: "/api/trpc",
		req,
		router: appRouter,
		createContext: () => createContext({ req }),
	});

export { handler as GET, handler as POST };