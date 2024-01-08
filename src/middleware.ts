import authConfig from '@/server/auth.config';
import NextAuth from 'next-auth';
import {
	DEFAULT_LOGIN_REDIRECT,
	apiAuthPrefix,
	authenticationRoutes,
	publicRoutes,
} from './routes';
export const { auth } = NextAuth(authConfig);
export default auth((req) => {
	const { nextUrl } = req;
	const isLoggedIn = req.auth;
	const isApiRoute = req.url.startsWith(apiAuthPrefix);
	const isPublicRoute = publicRoutes.includes(nextUrl.pathname);
	const isAuthRoute = authenticationRoutes.includes(nextUrl.pathname);

	if (isApiRoute) {
		return null;
	}

	if (isAuthRoute) {
		if (isLoggedIn) {
			return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));
		}
		return null;
	}

	if (!isLoggedIn && !isPublicRoute) {
		return Response.redirect(new URL('/auth/login', nextUrl));
	}

	return null;
});

export const config = {
	matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
};
