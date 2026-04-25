import clsx from 'clsx';
import { headers } from 'next/headers';
import { HTMLAttributes } from 'react';
import { getPageTitle } from '@/api/queries/getPageTitle';
import styles from './Title.module.scss';

interface TitleProps extends HTMLAttributes<HTMLHeadingElement> {}

export const Title = async ({ className }: TitleProps) => {
	const headersList = await headers();
	const pathname = headersList.get('x-pathname') || '';
	const slug = pathname.split('/').filter(Boolean)[0] || '';

	const title = await getPageTitle(slug);

	return <h1 className={clsx(styles.title, className)}>{title}</h1>;
};
