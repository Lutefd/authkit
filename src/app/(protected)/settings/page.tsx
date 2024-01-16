import { Button } from '@/components/ui/button';
import { signOut } from '@/server/auth';

import React from 'react';

async function SettingsPage() {
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
