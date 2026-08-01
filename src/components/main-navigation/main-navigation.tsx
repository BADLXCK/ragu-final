'use client';

import clsx from 'clsx';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FC, useEffect } from 'react';
import styles from './main-navigation.module.scss';

interface NavigationItem {
	id: string;
	uri?: string | null;
	path?: string | null;
	label?: string | null;
}

export const MainNavigation: FC<{ items: NavigationItem[] }> = ({ items }) => {
	const pathname = usePathname();

	useEffect(() => {
		document.body.removeAttribute('opened');
	}, [pathname]);

	return (
		<nav className={styles.navigation} role="navigation">
			<ul className={styles.navigationList}>
				{items.map(item => (
					<li
						key={item.id}
						className={clsx(styles.navigationItem, {
							[styles.active]: pathname.includes(
								(item.uri ?? '').replaceAll('/', ''),
							),
						})}
					>
						<Link
							className={`${styles.navigationLink}`}
							itemProp="url"
							href={`${item.path}`}
							key={item.id}
						>
							{item.label}
						</Link>
					</li>
				))}
			</ul>
		</nav>
	);
};
