'use server';
import { LoginSchema } from '@/schemas';
import { z } from 'zod';

import { signIn } from '@/server/auth';
import { AuthError } from 'next-auth';
import { getUserByEmail } from '@/lib/user';
import { generateVerificationToken } from '@/lib/token';

export const login = async (values: z.infer<typeof LoginSchema>) => {
	const validateFields = LoginSchema.safeParse(values);

	if (!validateFields.success) {
		return {
			error: 'Ocorreu um erro ao realizar o login',
		};
	}
	const { email, password } = validateFields.data;
	const user = await getUserByEmail(email);

	if (!user || !user.email) {
		return {
			error: 'Usuário não encontrado',
		};
	}
	if (!user.password) {
		return {
			error: 'Tenha certeza que você se cadastrou com o email e senha',
		};
	}
	if (!user.emailVerified) {
		const verificationToken = await generateVerificationToken(email);
		return {
			success: 'Confirmação de email enviada para o email',
		};
	}

	if (user.two_factor_method == 'EMAIL') {
		const verificationToken = await generateVerificationToken(email);
		return {
			success: 'Confirmação de login enviada para o email',
		};
	}

	try {
		await signIn('credentials', {
			email,
			password,
		});
		return {
			success: 'Login realizado com sucesso',
		};
	} catch (error) {
		if (error instanceof AuthError) {
			switch (error.type) {
				case 'CredentialsSignin':
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
