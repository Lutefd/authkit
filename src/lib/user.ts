import { dbPromise } from '@/server/db';
import { users } from '@/server/db/schema';
import { eq } from 'drizzle-orm';
export const getUserByEmail = async (email: string) => {
	const db = await dbPromise;
	try {
		const user = await db.query.users.findFirst({
			where: eq(users.email, email),
		});

		return user;
	} catch (error) {
		return null;
	}
};

export const getUserById = async (id: string) => {
	const db = await dbPromise;

	try {
		const user = await db.query.users.findFirst({
			where: eq(users.id, id),
		});

		return user;
	} catch (error) {
		return null;
	}
};

export const setDefaultRoleAndStatus = async (id: string) => {
	const db = await dbPromise;

	try {
		const user = await db
			.update(users)
			.set({
				role: 'USER',
				status: 'ACTIVE',
			})
			.where(eq(users.id, id));

		return user;
	} catch (error) {
		return null;
	}
};
