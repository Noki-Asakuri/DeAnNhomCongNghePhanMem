// src/server/db/client.ts
import { PrismaClient } from "@prisma/client";
import { type Connection, connect } from "@planetscale/database";
import { PrismaPlanetScale } from "@prisma/adapter-planetscale";
import { env } from "@/env.mjs";

declare global {
	// eslint-disable-next-line no-var
	var prisma: PrismaClient;

	// eslint-disable-next-line no-var
	var connection: Connection;

	// eslint-disable-next-line no-var
	var adapter: PrismaPlanetScale;
}

const connection = global.connection || connect({ url: env.DATABASE_URL, fetch: fetch });
const adapter = global.adapter || new PrismaPlanetScale(connection);

export const prisma =
	global.prisma ||
	new PrismaClient({
		log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
		adapter,
	});

if (process.env.NODE_ENV !== "production") {
	global.prisma = prisma;
	global.connection = connection;
	global.adapter = adapter;
}
