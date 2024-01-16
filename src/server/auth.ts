import NextAuth from 'next-auth';
import { DrizzleAdapter } from '@auth/drizzle-adapter';
import { authDb, dbPromise } from './db';
import authConfig from './auth.config';

export const {
	handlers: { GET, POST },
	auth,
	signIn,
	signOut,
} = NextAuth({
	adapter: DrizzleAdapter(authDb),
	session: {
		strategy: 'jwt',
	},
	...authConfig,
});
