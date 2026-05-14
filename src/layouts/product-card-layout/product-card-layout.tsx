import styles from './product-card-layout.module.scss';

export default async function ProductCardLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<div id="product-card-context" className={styles.wrapper}>
			{children}
		</div>
	);
}
