'use server';
import { LoginSchema } from '@/schemas';
import { z } from 'zod';

import { signIn } from '@/server/auth';
import { DEFAULT_LOGIN_REDIRECT } from '@/routes';
import { AuthError } from 'next-auth';

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
			callbackUrl: DEFAULT_LOGIN_REDIRECT,
		});
	} catch (error) {
		console.log(error);
		if (error instanceof AuthError) {
			switch (error.type) {
				case 'CredentialsSignin':
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
