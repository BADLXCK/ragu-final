import styles from './ProductCardLayout.module.css';

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
