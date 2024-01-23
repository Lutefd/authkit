import { dbPromise } from '@/server/db';
import { accounts } from '@/server/db/schema';
import { eq } from 'drizzle-orm';

export const getAccountByUserId = async (userId: string) => {
	const db = await dbPromise;
	try {
		const account = await db.query.accounts.findFirst({
			where: eq(accounts.userId, userId),
		});
		return account;
	} catch (error) {
		return null;
	}
};
