import { headers } from 'next/headers';
import { PropsWithChildren } from 'react';
import { getCategories } from '@/api/queries/getCategories';
import { CategoriesNavigation } from '@/components/categories-navigation';
import { Title } from '@/components/Title';
import styles from './MenuLayout.module.scss';

export const MenuLayout = async ({ children }: PropsWithChildren) => {
	const categories = await getCategories();
	const headersList = await headers();
	const pathname = headersList.get('x-pathname') || '';

	return (
		<div className={styles.wrapper}>
			<div className={styles.navigationArea}>
				<Title />
				<label className={styles.slogan}>{'выбери своё'}</label>
				<div className={styles.navigationWrapper}>
					<CategoriesNavigation
						categories={categories}
						currentPath={pathname}
					/>
				</div>
			</div>
			<section className={styles.pageArea}>{children}</section>
		</div>
	);
};
