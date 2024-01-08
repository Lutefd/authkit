'use server';
import { RegisterSchema } from '@/schemas';
import { z } from 'zod';

export const register = async (values: z.infer<typeof RegisterSchema>) => {
	const validateFields = RegisterSchema.safeParse(values);

	if (!validateFields.success) {
		return {
			error: 'Ocorreu um erro ao realizar o cadastro  ',
		};
	}

	return {
		success: 'Cadastro realizado com sucesso',
	};
};
