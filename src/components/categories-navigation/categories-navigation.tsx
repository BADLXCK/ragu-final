import clsx from 'clsx';
import Link from 'next/link';
import { FC } from 'react';
import { ProductCategory } from '@/api/gql/graphql';
import styles from './categories-navigation.module.scss';

interface CategoriesNavigationProps {
	categories: ProductCategory[];
	currentPath: string;
}

export const CategoriesNavigation: FC<CategoriesNavigationProps> = ({
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
