import { dbPromise } from '@/server/db';
import { verificationToken } from '@/server/db/schema';
import cuid2 from '@paralleldrive/cuid2';
import { eq } from 'drizzle-orm';

export const generateVerificationToken = async (email: string) => {
	const token = cuid2.createId();
	const expires = new Date(new Date().getTime() + 3600 * 1000);
	const db = await dbPromise;
	const existingToken = await getVerificationTokenByEmail(email);
	if (existingToken) {
		await db
			.delete(verificationToken)
			.where(eq(verificationToken.id, existingToken.id));
	}
	const newTokenData = {
		email,
		token,
		expires,
	};
	const newVerificationToken = await db
		.insert(verificationToken)
		.values(newTokenData)
		.returning({
			token: verificationToken.token,
		});
	return newVerificationToken;
};

export const getVerificationTokenByEmail = async (email: string) => {
	const db = await dbPromise;
	try {
		const result = await db.query.verificationToken.findFirst({
			where: eq(verificationToken.email, email),
		});
		return result;
	} catch (error) {
		return null;
	}
};
export const getVerificationTokenByToken = async (token: string) => {
	const db = await dbPromise;
	try {
		const result = await db.query.verificationToken.findFirst({
			where: eq(verificationToken.token, token),
		});
		return result;
	} catch (error) {
		return null;
	}
};
