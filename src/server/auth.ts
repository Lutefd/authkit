import NextAuth, { type DefaultSession } from 'next-auth';
import { DrizzleAdapter } from '@auth/drizzle-adapter';
import { authDb, dbPromise } from './db';
import authConfig from './auth.config';
import { getUserById } from '@/lib/user';

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
	callbacks: {
		async session({ session, token }) {
			if (token.sub && session.user) {
				session.user.id = token.sub;
			}
			if (token.role && session.user) {
				session.user.role = token.role as 'ADMIN' | 'USER' | null;
			}
			console.log('session', { session });
			console.log('token from session', { token });
			return session;
		},

		async jwt({ token }) {
			console.log('jwt token', { token });
			if (!token.sub) return token;
			const user = await getUserById(token.sub);
			if (!user) return token;
			console.log('user from jwt', { user });
			token.role = user.role;

			return token;
		},
	},
	adapter: DrizzleAdapter(authDb),
	session: {
		strategy: 'jwt',
	},
	...authConfig,
});
