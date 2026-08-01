'use client';

import Image from 'next/image';
import { FC } from 'react';
import styles from './Burger.module.css';

export const Burger: FC = () => {
	const handleClick = () => {
		document.body.toggleAttribute('opened');
	};

	return (
		<button type="button" className={styles.burger} onClick={handleClick}>
			<Image
				src="/burger.svg"
				alt="Открыть меню"
				width={24}
				height={24}
			/>
		</button>
	);
};
