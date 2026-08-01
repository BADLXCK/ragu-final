import clsx from 'clsx';
import Link from 'next/link';
import { FC } from 'react';
import styles from './MenuNavigation.module.css';

interface CategoryItem {
	id: string;
	name: string | null;
	slug: string | null;
}

interface MenuNavigationProps {
	categories: CategoryItem[];
	currentPath: string;
}

export const MenuNavigation: FC<MenuNavigationProps> = ({
	categories,
	currentPath,
}) => {
	return (
		<nav className={styles.navigation} role="navigation">
			<ul className={styles.navigationList}>
				{categories.map(category => (
					<li
						key={category.id}
						className={clsx(styles.navigationItem, {
							[styles.active]:
								currentPath.indexOf(category.slug ?? '') !== -1,
						})}
					>
						<Link
							key={category.id}
							className={styles.navigationLink}
							itemProp="url"
							href={`/menu/${category.slug}`}
						>
							{category.name}
						</Link>
					</li>
				))}
			</ul>
		</nav>
	);
};
