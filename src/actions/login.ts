'use server';
import { LoginSchema } from '@/schemas';
import { z } from 'zod';

import { signIn } from '@/server/auth';
import { AuthError } from 'next-auth';
import { getUserByEmail } from '@/lib/user';

export const login = async (values: z.infer<typeof LoginSchema>) => {
	const validateFields = LoginSchema.safeParse(values);

	if (!validateFields.success) {
		return {
			error: 'Ocorreu um erro ao realizar o login',
		};
	}
	const { email, password } = validateFields.data;

	try {
		await signIn('credentials', {
			email,
			password,
		});
	} catch (error) {
		if (error instanceof AuthError) {
			switch (error.type) {
				case 'CredentialsSignin':
					const user = await getUserByEmail(email);
					if (user?.status == 'BLOCKED') {
						return {
							error: 'Usuário bloqueado',
						};
					}
					return {
						error: 'Email ou senha incorretos',
					};
				default:
					return { error: 'Ocorreu um erro ao realizar o login' };
			}
		}
		throw error;
	}
};
