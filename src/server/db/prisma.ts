// src/server/db/client.ts
import { env } from "@/env";

import { Client } from "@planetscale/database";
import { PrismaPlanetScale } from "@prisma/adapter-planetscale";
import { PrismaClient } from "@prisma/client";

const psClient = new Client({ url: env.DATABASE_URL });

const createPrismaClient = () =>
	new PrismaClient({
		log: env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
		adapter: new PrismaPlanetScale(psClient),
	});

const globalForPrisma = globalThis as unknown as {
	prisma: ReturnType<typeof createPrismaClient> | undefined;
};

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

