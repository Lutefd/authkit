// Example model schema from the Drizzle docs
// https://orm.drizzle.team/docs/sql-schema-declaration

import {
	timestamp,
	pgTableCreator,
	text,
	primaryKey,
	integer,
	uuid,
} from 'drizzle-orm/pg-core';
import type { AdapterAccount } from '@auth/core/adapters';

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const pgTable = pgTableCreator((name) => `project1_${name}`);

export const users = pgTable('user', {
	id: uuid('id').defaultRandom().notNull().primaryKey(),
	name: text('name'),
	email: text('email').notNull(),
	emailVerified: timestamp('emailVerified', { mode: 'date' }),
	password: text('password'),
	image: text('image'),
});
export const accounts = pgTable(
	'account',
	{
		userId: text('userId')
			.notNull()
			.references(() => users.id, { onDelete: 'cascade' }),
		type: text('type').$type<AdapterAccount['type']>().notNull(),
		provider: text('provider').notNull(),
		providerAccountId: text('providerAccountId').notNull(),
		refresh_token: text('refresh_token'),
		access_token: text('access_token'),
		expires_at: integer('expires_at'),
		token_type: text('token_type'),
		scope: text('scope'),
		id_token: text('id_token'),
		session_state: text('session_state'),
	},
	(account) => ({
		compoundKey: primaryKey({
			columns: [account.provider, account.providerAccountId],
		}),
	})
);

// export const sessions = pgTable('session', {
// 	sessionToken: text('sessionToken').notNull().primaryKey(),
// 	userId: text('userId')
// 		.notNull()
// 		.references(() => users.id, { onDelete: 'cascade' }),
// 	expires: timestamp('expires', { mode: 'date' }).notNull(),
// });

// export const verificationTokens = pgTable(
// 	'verificationToken',
// 	{
// 		identifier: text('identifier').notNull(),
// 		token: text('token').notNull(),
// 		expires: timestamp('expires', { mode: 'date' }).notNull(),
// 	},
// 	(vt) => ({
// 		compoundKey: primaryKey({ columns: [vt.identifier, vt.token] }),
// 	})
// );
