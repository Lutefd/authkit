'use client';

import { usePathname } from 'next/navigation';
import {
	NavigationMenu,
	NavigationMenuContent,
	NavigationMenuItem,
	NavigationMenuLink,
	NavigationMenuList,
	NavigationMenuTrigger,
	navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu';
import Link from 'next/link';
import UserBtn from '@/components/auth/UserBtn';

function Navbar() {
	const pathname = usePathname();
	return (
		<div className="bg-white flex justify-between items-center p-4 rounded-xl w-full shadow-sm">
			<NavigationMenu>
				<NavigationMenuList>
					<NavigationMenuItem>
						{' '}
						<Link
							className={navigationMenuTriggerStyle()}
							href="/server"
						>
							Server
						</Link>
					</NavigationMenuItem>
					<NavigationMenuItem>
						{' '}
						<Link
							className={navigationMenuTriggerStyle()}
							href="/client"
						>
							Client
						</Link>
					</NavigationMenuItem>
					<NavigationMenuItem>
						{' '}
						<Link
							className={navigationMenuTriggerStyle()}
							href="/admin"
						>
							Admin
						</Link>
					</NavigationMenuItem>
					<NavigationMenuItem>
						{' '}
						<Link
							className={navigationMenuTriggerStyle()}
							href="/settings"
						>
							Settings
						</Link>
					</NavigationMenuItem>
				</NavigationMenuList>
			</NavigationMenu>
			<UserBtn />
		</div>
	);
}

export default Navbar;
