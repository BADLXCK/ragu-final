import { FC } from "react";
import Image from "next/image";
import styles from './product-list-item.module.scss';
import Link from 'next/link';
import { ExtendedProduct } from "@/api/gql/extended-types";

export const ProductListItem: FC<{ product: ExtendedProduct, category: string }> = ({
    product: { name, description, customWeight, price, image, slug },
    category,
}) => {
    return (
        <Link href={`/menu/${category}/${slug || ''}`} className={styles.wrapper}>
            <div className={styles.productInfo}>
                <h2 className={styles.name}>{name}</h2>
                {description && <div className={styles.description}>{description}</div>}
                <div className={styles.productPrice}>
                    {price && <pre className={styles.price}>{`₽ ${price}`}</pre>}
                    {customWeight && <span className={styles.weight}>{`${customWeight} гр.`}</span>}
                </div>
            </div>
            <div className={styles.productImage}>
                {image && image.filePath && (
                    <Image
                        className={styles.image}
                        src={`http://wordpress:80${image.filePath}`}
                        alt={image.altText || name || 'Изображение продукта'}
                        style={{
                            objectFit: "cover",
                        }}
                        fill
                    />
                )}
            </div>
        </Link>
    );
};