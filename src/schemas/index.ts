import { z } from 'zod';

export const LoginSchema = z.object({
	email: z.string().email({
		message: 'O email deve ser válido',
	}),
	password: z.string().min(1, {
		message: 'A senha é obrigatória',
	}),
});

export const RegisterSchema = z.object({
	email: z.string().email({
		message: 'O email deve ser válido',
	}),
	password: z
		.string()
		.min(8, {
			message: 'A senha deve ter no mínimo 8 caracteres',
		})
		.max(44, {
			message: 'A senha deve ter no máximo 44 caracteres',
		}),
	name: z.string(),
});
