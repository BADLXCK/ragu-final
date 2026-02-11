'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import styles from './title.module.scss';

interface TitleProps {
    className?: string;
}

export const Title = ({ className }: TitleProps) => {
    const pathname = usePathname();
    const [title, setTitle] = useState<string>('');

    useEffect(() => {
        const fetchTitle = async () => {
            const slug = pathname?.split('/').find(item => item !== '');

            if (!slug) {
                setTitle('');
                return;
            }

            try {
                const response = await fetch(`/api/title?slug=${slug}`);
                const data = await response.json();
                setTitle(data.title || '');
            } catch (error) {
                setTitle('');
            }
        };

        fetchTitle();
    }, [pathname]);

    if (!title) return null;

    return (
        <h1 className={`${styles.title} ${className}`}>{title}</h1>
    );
};