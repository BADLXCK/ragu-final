import Image from 'next/image';
import Link from 'next/link';
import { FC } from 'react';

interface LogoProps {
	className?: string;
}

export const Logo: FC<LogoProps> = ({ className }) => {
	return (
		<Link className={className} href={'/'}>
			<Image
				src={'/logo.svg'}
				alt="Логотип ресторана Рагу"
				width={0}
				height={0}
				style={{ width: '100%', height: 'auto' }}
			/>
		</Link>
	);
};
