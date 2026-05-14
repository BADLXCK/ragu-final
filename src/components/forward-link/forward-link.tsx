import Image from 'next/image';
import Link from 'next/link';
import { CSSProperties, FC } from 'react';

interface IForwardLink {
	href: string;
	alt: string;
	backward?: boolean;
	style?: CSSProperties;
	className?: string;
	src?: string;
}

export const ForwardLink: FC<IForwardLink> = ({
	href,
	alt = 'Вперёд',
	backward = false,
	style,
	className,
	src = '/forward.svg',
}) => {
	return (
		<Link href={href}>
			<Image
				src={src}
				alt={alt}
				width={56}
				height={56}
				style={{
					transform: backward ? 'rotate(180deg)' : 'rotate(0deg)',
					...style,
				}}
				className={className}
			/>
		</Link>
	);
};
