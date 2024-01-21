'use server';

import { getUserByEmail } from '@/lib/user';
import { ResetSchema } from '@/schemas';
import { z } from 'zod';
import { sendPasswordResetEmail } from './email';
import { generatePasswordResetToken } from '@/lib/token';

export const reset = async (values: z.infer<typeof ResetSchema>) => {
	const validatedFields = ResetSchema.safeParse(values);

	if (!validatedFields.success) {
		return {
			error: 'Email inválido',
		};
	}
	const { email } = validatedFields.data;

	const existingUser = await getUserByEmail(email);

	if (!existingUser) {
		return {
			error: 'Email não encontrado',
		};
	}
	const passwordResetToken = await generatePasswordResetToken(email);
	await sendPasswordResetEmail(email, passwordResetToken[0].token);
	return {
		success: 'Email enviado com sucesso',
	};
};
