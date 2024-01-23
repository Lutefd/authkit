'use server';

import { dbPromise } from '@/server/db';
import { users } from '@/server/db/schema';
import { eq } from 'drizzle-orm';
import { decodeHex } from 'oslo/encoding';
import { TOTPController } from 'oslo/otp';

export const verifyTOTP = async (code: string, userId: string) => {
	const db = await dbPromise;
	const secret = await db.query.users.findFirst({
		where: eq(users.id, userId),
		columns: {
			two_factor_secret: true,
		},
	});
	if (!secret?.two_factor_secret)
		return {
			error: 'Segredo não encontrado',
		};
	const validOTP = await new TOTPController().verify(
		code,
		decodeHex(secret.two_factor_secret)
	);
	console.log(validOTP);
	if (!validOTP) {
		return {
			error: 'Código inválido',
		};
	}
	return {
		success: 'Código válido',
	};
};

export const verifyTOTPInConfig = async (code: string, userId: string) => {
	const db = await dbPromise;
	const secret = await db.query.users.findFirst({
		where: eq(users.id, userId),
		columns: {
			two_factor_secret: true,
		},
	});
	if (!secret?.two_factor_secret)
		return {
			error: 'Segredo não encontrado',
		};
	const validOTP = await new TOTPController().verify(
		code,
		decodeHex(secret.two_factor_secret)
	);
	if (!validOTP)
		return {
			error: 'Código inválido',
		};
	await db
		.update(users)
		.set({ two_factor_method: 'AUTHENTICATOR' })
		.where(eq(users.id, userId));
	return {
		success: 'Código válido',
	};
};
