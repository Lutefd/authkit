import { DEFAULT_LOGIN_REDIRECT } from '@/routes';
import { auth } from '@/server/auth';
import { redirect } from 'next/navigation';
import SessionProvider from '@/components/providers/SessionProvider';

const AuthLayout = async ({ children }: { children: React.ReactNode }) => {
	const session = await auth();
	if (!session) {
		redirect('/auth/login');
	}
	return (
		<div className="">
			<SessionProvider session={session}>{children}</SessionProvider>
		</div>
	);
};

export default AuthLayout;
