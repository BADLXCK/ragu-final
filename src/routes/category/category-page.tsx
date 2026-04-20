import { FC } from 'react';
import { getCategory } from '@/api/queries/getCategory';
import { getProductsByCategory } from '@/api/queries/getProductsByCategory';
import { ProductListItem } from '@/components/product-list-item';
import styles from './category-page.module.scss';

export interface CategoryPageProps {
	params: Promise<{ category: string }>;
}

export const CategoryPage: FC<CategoryPageProps> = async ({ params }) => {
	const { category: categorySlug } = await params;
	const category = await getCategory(categorySlug);

	if (!category) {
		return <h1>Категория не найдена</h1>;
	}

	const { name: categoryName } = category;
	const productList = await getProductsByCategory(categorySlug);

	return (
		<div className={styles.wrapper}>
			<h1 className={styles.title}>{categoryName}</h1>
			<div className={styles.list}>
				{productList.map(product => (
					<ProductListItem key={product.id} {...product} />
				))}
			</div>
		</div>
	);
};
