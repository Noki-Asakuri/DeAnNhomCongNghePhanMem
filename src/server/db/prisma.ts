// src/server/db/client.ts
import { env } from "@/env";

import { Client } from "@planetscale/database";
import { PrismaPlanetScale } from "@prisma/adapter-planetscale";
import { PrismaClient } from "@prisma/client";

declare global {
	// eslint-disable-next-line no-var
	var prisma: PrismaClient;
}

const client = new Client({ url: env.DATABASE_URL, fetch });
const adapter = new PrismaPlanetScale(client);

export const prisma =
	global.prisma ||
	new PrismaClient({
		log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
		adapter,
	});

if (process.env.NODE_ENV !== "production") {
	global.prisma = prisma;
}
