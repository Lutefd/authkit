import NextAuth, { type DefaultSession } from 'next-auth';
import { DrizzleAdapter } from '@auth/drizzle-adapter';
import { authDb } from './db';
import authConfig from './auth.config';
import { getUserById, setDefaultValues } from '@/lib/user';
import { pgTable } from './db/schema';
import {
	deleteEmailTwoFactorConfirmation,
	getEmailTwoFactorConfirmation,
} from '@/lib/two-factor-authentication';

declare module 'next-auth' {
	interface Session {
		user: {
			role: string | null;
			twoFactorMethod: string | null;
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
		async signIn({ user, account }) {
			const existingUser = await getUserById(user.id);
			if (existingUser?.status == 'BLOCKED') {
				return false;
			}
			if (account?.provider != 'credentials') {
				return true;
			}
			if (!existingUser?.emailVerified) return false;

			if (existingUser.two_factor_method == 'EMAIL') {
				const twoFactorConfirmation =
					await getEmailTwoFactorConfirmation(existingUser.id);
				if (!twoFactorConfirmation) {
					return false;
				}
				await deleteEmailTwoFactorConfirmation(existingUser.id);
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
			if (token.twoFactorMethod && session.user) {
				session.user.twoFactorMethod = token.twoFactorMethod as
					| 'NONE'
					| 'EMAIL'
					| 'AUTHENTICATOR'
					| null;
			}

			return session;
		},

		async jwt({ token, account }) {
			if (!token.sub) return token;
			if (account) {
				const user = await getUserById(token.sub);
				if (!user) return token;
				token.twoFactorMethod = user.two_factor_method;
				token.role = user.role;
			}
			return token;
		},
	},
	adapter: DrizzleAdapter(authDb, pgTable),
	session: {
		strategy: 'jwt',
	},
	trustHost: true,
	...authConfig,
});
