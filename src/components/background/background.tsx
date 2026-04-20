import Image from 'next/image';
import { PropsWithChildren } from 'react';
import styles from './background.module.scss';

export const Background = ({ children }: PropsWithChildren) => {
	return (
		<>
			<Image
				src={'/background.png'}
				className={`${styles.background}`}
				quality={100}
				alt={'Фон с камином'}
				fill
			/>
			<div className={styles.wrapper}>{children}</div>
		</>
	);
};
