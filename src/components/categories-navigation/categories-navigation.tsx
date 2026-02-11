"use client"

import { FC } from "react";
import styles from './categories-navigation.module.scss';
import { usePathname } from "next/navigation";
import Link from "next/link";
import { ProductCategory } from "@/api/gql/graphql";

export const CategoriesNavigation: FC<{ categories: ProductCategory[] }> = ({ categories }) => {
    const pathname = usePathname() ?? '';

    return (
        <nav className={`${styles.navigation}`} role="navigation">
            <ul className={`${styles.navigationList}`}>
                {categories.map(category =>
                    <li
                        className={`${styles.navigationItem} ${pathname.indexOf(category.slug ?? '') !== -1 ? styles.active : ''}`}
                        key={category.id}
                    >
                        <Link
                            className={`${styles.navigationLink}`}
                            itemProp="url"
                            href={`/menu/${category.slug}`}
                            key={category.id}
                        >
                            {category.name}
                        </Link>
                    </li>
                )}
            </ul>
        </nav>
    )
}