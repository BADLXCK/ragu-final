import Image from "next/image";
import styles from './product-page.module.scss';
import { getProductsByCategory } from '@/api/queries/getProductsByCategory';
import { getProduct } from '@/api/queries/getProduct';
import { CloseButton } from '@/components/close-button';
import { ForwardLink } from '@/components/forward-link';

export default async function ProductPage({ params }: { params: Promise<{ category: string, product: string }> }) {
    const { category, product } = await params;

    const products = await getProductsByCategory(category);
    const productIndex = products.findIndex(item => item.slug === product);
    const nextProduct = productIndex !== products.length - 1 ? products[productIndex + 1] : null;
    const previousProduct = productIndex !== 0 ? products[productIndex - 1] : null;
    const productInfo = await getProduct(product);

    return (
        <div className={styles.wrapper}>
            <div className={styles.productSwitcher}>
                {previousProduct && <ForwardLink backward href={`/menu/${category}/${previousProduct?.slug}`} alt={'Назад'} />}
            </div>
            <div className={styles.productCard}>
                <CloseButton categorySlug={category} className={styles.close} />
                <div className={styles.name}>{productInfo.name}</div>
                <div className={styles.description}>{productInfo.description}</div>
                <div className={styles.imageContainer}>
                    {productInfo.image && productInfo.image.filePath && (
                        <Image
                            src={`http://wordpress:80${productInfo.image.filePath}`}
                            className={styles.image}
                            alt={productInfo.image.altText || productInfo.name || 'Изображение продукта'}
                            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                            fill
                        />
                    )}
                </div>
                <div className={styles.info}>
                    <div className={styles.price}>{`₽ ${productInfo.price}`}</div>
                    <div className={styles.weight}>{`${productInfo.customWeight} гр.`}</div>
                </div>
                <div className={styles.nutrients}>
                    <span>{'БЖУ:'}</span>
                    <span>{`белки: ${productInfo.customProtein}`}</span>
                    <span>{`жиры: ${productInfo.customFat}`}</span>
                    <span>{`углеводы: ${productInfo.customCarbohydrate}`}</span>
                </div>
                <Image
                    src={'/organic.svg'}
                    className={styles.organic}
                    alt={'Органический'}
                    width={57}
                    height={57}
                />
            </div>
            <div className={styles.productSwitcher}>
                {nextProduct && <ForwardLink href={`/menu/${category}/${nextProduct?.slug}`} alt={'Вперед'} />}
            </div>
        </div>
    )
}