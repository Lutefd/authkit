import authConfig from '@/server/auth.config';
import NextAuth from 'next-auth';
import { apiAuthPrefix } from './routes';
export const { auth } = NextAuth(authConfig);
export default auth((req) => {
	const { nextUrl } = req;
	const isLoggedIn = req.auth;
	const isApiRoute = req.url.startsWith(apiAuthPrefix);
});

export const config = {
	matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
};
