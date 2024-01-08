import { auth } from '@/server/auth';
import React from 'react';

async function SettingsPage() {
	const session = await auth();
	console.log(session);
	return <div>SettingsPage</div>;
}

export default SettingsPage;
