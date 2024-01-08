import { Button } from '@/components/ui/button';
import { auth, signOut } from '@/server/auth';
import React from 'react';

async function SettingsPage() {
	const session = await auth();
	console.log(session);
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
		</div>
	);
}

export default SettingsPage;
