'use server';
import { RegisterSchema } from '@/schemas';
import { z } from 'zod';
import bcrypt from 'bcryptjs';
import { dbPromise } from '@/server/db';
import { eq } from 'drizzle-orm';
import { accounts, users } from '@/server/db/schema';
import cuid2 from '@paralleldrive/cuid2';

export const register = async (values: z.infer<typeof RegisterSchema>) => {
	const db = await dbPromise;
	const validateFields = RegisterSchema.safeParse(values);

	if (!validateFields.success) {
		return {
			error: 'Ocorreu um erro ao realizar o cadastro  ',
		};
	}
	const {
		email: inputEmail,
		password,
		name: inputName,
	} = validateFields.data;

	const hashPassword = await bcrypt.hash(password, 10);

	const existingUser = await db.query.users.findFirst({
		where: eq(users.email, inputEmail),
	});

	if (existingUser) {
		return {
			error: 'Usuário já cadastrado',
		};
	}
	const user = {
		id: cuid2.createId(),
		email: inputEmail,
		password: hashPassword,
		name: inputName,
	};
	await db.insert(users).values(user);

	return {
		success: 'Cadastro realizado com sucesso',
	};
};
