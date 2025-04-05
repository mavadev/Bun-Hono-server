import { defineConfig } from 'drizzle-kit';

if (process.env.TURSO_CONNECTION_URL === undefined || process.env.TURSO_AUTH_TOKEN === undefined)
	throw new Error('Missing TURSO_CONNECTION_URL or TURSO_AUTH_TOKEN');

export default defineConfig({
	schema: './src/db/schema.ts',
	out: './migrations',
	dialect: 'turso',
	dbCredentials: {
		url: process.env.TURSO_CONNECTION_URL!,
		authToken: process.env.TURSO_AUTH_TOKEN!,
	},
});
