import { FC } from "react"
import styles from './gallery-widget.module.scss';
import Image from "next/image";
import Link from 'next/link';

interface GalleryWidgetProps {
    className?: string;
}

export const GalleryWidget: FC<GalleryWidgetProps> = ({ className }) => {
    return (
        <Link href={'/gallery'} className={`${styles.container} ${className}`}>
            <div className={styles.event}>
                <Image
                    src={'/gallery/event.png'}
                    width={300}
                    height={340}
                    style={{
                        objectFit: "cover",
                        borderRadius: '36px 0px 0px 36px',
                    }}
                    alt={'Торжественные мероприятия'}
                />
            </div>
            <div className={styles.birthday}>
                <Image
                    src={'/gallery/birthday.png'}
                    width={300}
                    height={160}
                    style={{
                        objectFit: "cover",
                        borderRadius: '0px 36px 0px 0px',
                    }}
                    alt={'Дни рождения'}
                />
            </div>
            <div className={styles.gallery}>
                <Image
                    src={'/gallery/gallery.png'}
                    width={140}
                    height={160}
                    style={{
                        objectFit: "cover",
                    }}
                    alt={'Галерея'}
                />
            </div>
            <div className={styles.other}>
                <Image
                    src={'/gallery/other.png'}
                    width={140}
                    height={160}
                    style={{
                        objectFit: "cover",
                        borderRadius: '0px 0px 36px 0px',
                    }}
                    alt={'Другое'}
                />
            </div>
        </Link>
    )
}