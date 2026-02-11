"use client"

import { FC, useEffect } from "react";
import styles from "./main-navigation.module.scss";
import { usePathname } from "next/navigation";
import Link from 'next/link';
import { MenuItem } from "@/api/gql/graphql";
import clsx from "clsx";

export const MainNavigation: FC<{ items: MenuItem[] }> = ({ items }) => {
    const pathname = usePathname();

    useEffect(() => {
        document.body.removeAttribute('opened');
    }, [pathname]);

    return (
        <nav className={styles.navigation} role="navigation">
            <ul className={styles.navigationList}>
                {items.map(item =>
                    <li
                        key={item.id}
                        className={clsx(styles.navigationItem, {
                            [styles.active]: pathname.includes((item.uri ?? '').replaceAll('/', ''))
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
                )}
            </ul>
        </nav >
    )
};