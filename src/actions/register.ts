'use server';
import { RegisterSchema } from '@/schemas';
import { z } from 'zod';
import bcrypt from 'bcryptjs';
import { db } from '@/server/db';

export const register = async (values: z.infer<typeof RegisterSchema>) => {
	const validateFields = RegisterSchema.safeParse(values);

	if (!validateFields.success) {
		return {
			error: 'Ocorreu um erro ao realizar o cadastro  ',
		};
	}
	const { email, password, name } = validateFields.data;

	const hashPassword = await bcrypt.hash(password, 10);

	const existingUser = await db.user.findUnique({
		where: {
			email,
		},
	});

	if (existingUser) {
		return {
			error: 'Usuário já cadastrado',
		};
	}

	await db.user.create({
		data: {
			email,
			password: hashPassword,
			name,
		},
	});

	return {
		success: 'Cadastro realizado com sucesso',
	};
};
