import Link from 'next/link';

interface CloseButtonProps {
	categorySlug: string;
	className?: string;
}

export const CloseButton: React.FC<CloseButtonProps> = ({
	categorySlug,
	className = '',
}) => {
	return (
		<Link
			href={`/menu/${categorySlug}`}
			className={className}
			style={{
				width: 24,
				height: 24,
				padding: 20,
				background: 'url(/close.svg) no-repeat center center',
			}}
			aria-label={'Закрыть'}
		/>
	);
};
