'use client';
import { logout } from '@/actions/logout';
import { Button } from '@/components/ui/button';
import { useSession } from 'next-auth/react';

import React from 'react';

function SettingsPage() {
	const session = useSession();

	const onClick = () => {
		logout();
	};

	return (
		<div>
			SettingsPage
			<Button type="submit" onClick={onClick}>
				Sair
			</Button>
			{JSON.stringify(session)}
		</div>
	);
}

export default SettingsPage;
