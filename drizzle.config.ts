import type { Config } from "drizzle-kit";
import * as dotenv from "dotenv";

dotenv.config();

export default {
	schema: "./src/server/db/schema/*",
	out: "./drizzle",
	driver: "mysql2",
	dbCredentials: {
		connectionString: process.env.DATABASE_URL as string,
	},
} satisfies Config;
