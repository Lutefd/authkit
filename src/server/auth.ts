import NextAuth, { type DefaultSession } from 'next-auth';
import { DrizzleAdapter } from '@auth/drizzle-adapter';
import { authDb, dbPromise } from './db';
import authConfig from './auth.config';
import { getUserById, setDefaultValues } from '@/lib/user';
import { pgTable } from './db/schema';

declare module 'next-auth' {
	interface Session {
		user: {
			role: string | null;
		} & DefaultSession['user'];
	}
}

export const {
	handlers: { GET, POST },
	auth,
	signIn,
	signOut,
} = NextAuth({
	pages: {
		signIn: '/auth/login',
		error: '/auth/error',
	},
	events: {
		async linkAccount({ user }) {
			await setDefaultValues(user.id);
		},
	},
	callbacks: {
		async signIn({ user }) {
			const existingUser = await getUserById(user.id);
			if (existingUser?.status == 'BLOCKED') {
				return false;
			}
			return true;
		},

		async session({ session, token }) {
			if (token.sub && session.user) {
				session.user.id = token.sub;
			}
			if (token.role && session.user) {
				session.user.role = token.role as 'ADMIN' | 'USER' | null;
			}

			return session;
		},

		async jwt({ token, account }) {
			if (!token.sub) return token;
			const user = await getUserById(token.sub);
			if (!user) return token;

			token.role = user.role;
			return token;
		},
	},
	adapter: DrizzleAdapter(authDb, pgTable),
	session: {
		strategy: 'jwt',
	},
	...authConfig,
});
