import Image from 'next/image';
import { PropsWithChildren } from 'react';
import styles from './Background.module.css';

export const Background = ({ children }: PropsWithChildren) => {
	return (
		<>
			<Image
				src="/background.png"
				className={`${styles.background}`}
				quality={100}
				alt="Фон с камином"
				fill
			/>
			<div className={styles.wrapper}>{children}</div>
		</>
	);
};
