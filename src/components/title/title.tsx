'use client';

import { gql } from 'graphql-request';
import { usePathname } from 'next/navigation';
import React, { HTMLAttributes, useEffect, useState } from 'react';
import { client } from '@/api/client';
import styles from './title.module.scss';

interface TitleProps extends HTMLAttributes<HTMLHeadingElement> {}

const GET_PAGE_TITLE = gql`
	query getPageTitle($slug: String!) {
		pageBy(uri: $slug) {
			title
		}
	}
`;

export const Title = ({ className }: TitleProps) => {
	const pathname = usePathname();
	const [title, setTitle] = useState<string | null>(null);

	useEffect(() => {
		const slug = pathname.split('/').find(item => item !== '') || '';
		if (!slug) {
			setTitle(null);
			return;
		}

		client
			.request<{ pageBy: { title: string } | null }>(GET_PAGE_TITLE, {
				slug,
			})
			.then(data => {
				setTitle(data.pageBy?.title || null);
			})
			.catch(() => {
				setTitle(null);
			});
	}, [pathname]);

	if (!title) return null;

	return <h1 className={`${styles.title} ${className}`}>{title}</h1>;
};
