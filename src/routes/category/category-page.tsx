import styles from './category-page.module.scss';
import { ProductListItem } from "@/components/product-list-item";
import { getCategory } from "@/api/queries/getCategory";
import { getProductsByCategory } from "@/api/queries/getProductsByCategory";
import { FC } from 'react';

export interface CategoryPageProps {
    params: Promise<{ category: string }>;
}

export const CategoryPage: FC<CategoryPageProps> = async ({ params }) => {
    const { category: categorySlug } = await params;
    const category = await getCategory(categorySlug);

    if (!category) {
        return (
            <div>
                <h1>Категория не найдена</h1>
                <span>{'Категория не существует :('}</span>
            </div>
        );
    }

    const { name: categoryName } = category;
    const productList = await getProductsByCategory(categorySlug);

    return (
        <div className={styles.wrapper}>
            <h1 className={styles.title}>{categoryName}</h1>
            {productList.length ?
                <div className={styles.list}>
                    {productList.map(product =>
                        <ProductListItem
                            key={product.id}
                            product={product}
                            category={categorySlug || ''}
                        />
                    )}
                </div>
                :
                <span>{'Ничего не найдено :('}</span>
            }
        </div>
    )
}