'use client';
import { logout } from '@/actions/logout';
import { Button } from '@/components/ui/button';
import { useCurrentUser } from '@/hooks/useCurrentUser';

import React from 'react';

function SettingsPage() {
	const session = useCurrentUser();

	const onClick = () => {
		logout();
	};

	return (
		<div className="bg-white p-10 rounded-xl">
			<Button type="submit" onClick={onClick}>
				Sair
			</Button>
		</div>
	);
}

export default SettingsPage;
