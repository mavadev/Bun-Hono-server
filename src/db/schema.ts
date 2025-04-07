import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const usersTable = sqliteTable('users', {
	id: integer('id').primaryKey(),
	username: text('username').unique(),
	email: text('email').unique().notNull(),
	password: text('password').notNull(),
	verification_token: text('verification_token'),
	verification_expires: integer('verification_expires'),
	verified: integer('verified', { mode: 'boolean' }).default(false),
});

export type InsertUser = typeof usersTable.$inferInsert;
export type SelectUser = typeof usersTable.$inferSelect;
