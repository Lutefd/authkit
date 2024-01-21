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

export const setDefaultValues = async (id: string) => {
	const db = await dbPromise;

	try {
		const user = await db
			.update(users)
			.set({
				role: 'USER',
				status: 'ACTIVE',
				emailVerified: new Date(),
				two_factor_method: 'NONE',
			})
			.where(eq(users.id, id))
			.returning({
				role: users.role,
				id: users.id,
				name: users.name,
				email: users.email,
				image: users.image,
				status: users.status,
				emailVerified: users.emailVerified,
				two_factor_method: users.two_factor_method,
			});

		return user;
	} catch (error) {
		return null;
	}
};

export const setUserRole = async (id: string, role: 'ADMIN' | 'USER') => {
	const db = await dbPromise;

	try {
		const user = await db
			.update(users)
			.set({
				role,
			})
			.where(eq(users.id, id));

		return user;
	} catch (error) {
		return null;
	}
};

export const setUserStatus = async (
	id: string,
	status: 'ACTIVE' | 'BLOCKED'
) => {
	const db = await dbPromise;

	try {
		const user = await db
			.update(users)
			.set({
				status,
			})
			.where(eq(users.id, id));

		return user;
	} catch (error) {
		return null;
	}
};
