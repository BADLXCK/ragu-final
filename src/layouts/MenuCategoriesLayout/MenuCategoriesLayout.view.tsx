import { getCategories } from "@/api/queries/getCategories";
import { CategoriesNavigation } from "@/components/categories-navigation";
import styles from "./MenuCategoriesLayout.module.scss";
import { FC } from "react";

export async function generateStaticParams() {
    const categories = await getCategories();
    return categories.map(category => ({ category: category.slug }))
};

interface MenuCategoryLayoutProps {
    children: React.ReactNode;
}

export const MenuCategoryLayout: FC<MenuCategoryLayoutProps> = async ({ children }) => {
    const categories = await getCategories();

    return (
        <div className={styles.wrapper}>
            <div className={styles.navigationArea}>
                <label className={`${styles.title}`}>{'Menu'}</label>
                <label className={`${styles.slogan}`}>{'выбери своё'}</label>
                <div className={styles.navigationWrapper}>
                    <CategoriesNavigation categories={categories} />
                </div>
            </div>
            <section className={styles.pageArea}>
                {children}
            </section>
        </div>
    )
}