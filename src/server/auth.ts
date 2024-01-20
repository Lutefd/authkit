import NextAuth, { type DefaultSession } from 'next-auth';
import { DrizzleAdapter } from '@auth/drizzle-adapter';
import { authDb, dbPromise } from './db';
import authConfig from './auth.config';
import { getUserById, setDefaultRoleAndStatus } from '@/lib/user';
import { RoleEnum, pgTable } from './db/schema';

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
		async signIn({ user }) {
			const existingUser = await getUserById(user.id);
			if (existingUser?.status == null || existingUser?.role == null) {
				await setDefaultRoleAndStatus(user.id);
			}
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
			if (account && account.access_token) {
				if (!token.sub) return token;
				const user = await getUserById(token.sub);
				if (!user) return token;
				console.log('user', user);
				if (user.status == null || user.role == null) {
					console.log('setDefaultRoleAndStatus');
					const updatedUser = await setDefaultRoleAndStatus(user.id);
					if (!updatedUser) return token;
					token.role = updatedUser[0].role;
					console.log('token role', token.role);
				} else {
					token.role = user.role;
				}

				console.log('jwt', token);
			}
			return token;
		},
	},
	adapter: DrizzleAdapter(authDb, pgTable),
	session: {
		strategy: 'jwt',
	},
	...authConfig,
});
