import { Button } from '@/components/ui/button';
import { auth, signOut } from '@/server/auth';

import React from 'react';

async function SettingsPage() {
	const session = await auth();

	return (
		<div>
			SettingsPage
			<form
				action={async () => {
					'use server';
					await signOut();
				}}
			>
				<Button type="submit">Sair</Button>
			</form>
			{JSON.stringify(session)}
		</div>
	);
}

export default SettingsPage;
