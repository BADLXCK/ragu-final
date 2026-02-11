'use client';

import Image from "next/image";
import styles from './gallery-page.module.scss';
import Link from "next/link";

export default function GalleryPage() {
    return (
        <div className={styles.wrapper}>
            <div className={styles.title}>
                <h1>{'Галерея'}</h1>
                <h2>{'Фото и видео нашего ресторана'}</h2>
            </div>
            <div className={styles.description}>
                Два зала с эстетичным интерьером: один просторный с настоящим атмосферным камином, второй — кулуарный с панорамными окнами. В обстановке преобладают спокойные голубые тона, классические люстры соседствуют с авангардными светильниками.
            </div>
            <Link href={'/banquet/choose-event'} className={`${styles.event} ${styles.imageWrapper}`}>
                <Image
                    src={'/gallery/event.png'}
                    alt={"Торжественное мероприятие"}
                    style={{ objectFit: 'cover', borderRadius: '0px 0px 0px 30px' }}
                    sizes='100vw'
                    fill
                />
                <div className={styles.imageText}>
                    <span className={styles.upper}>{'Торжественное мероприятие'}</span>
                    <span className={styles.middle}>{'Свадьба, знаковая дата, свидание,\n все это вы можете отметить у нас'}</span>
                    <span className={styles.bottom}>{'от 50 тыс. руб.'}</span>
                </div>
            </Link>
            <Link href={'/banquet/choose-event'} className={`${styles.birthday} ${styles.imageWrapper}`}>
                <Image
                    src={'/gallery/birthday.png'}
                    alt={"День рождения"}
                    style={{ objectFit: 'cover' }}
                    sizes='100vw'
                    fill
                />
                <div className={styles.imageText}>
                    <span className={styles.upper}>{'День рождения'}</span>
                    <span className={styles.middle}>{'доверьте ВАШ день в НАШИ руки'}</span>
                    <span className={styles.bottom}>{'от 50 тыс. руб.'}</span>
                </div>
            </Link>
            <Link href={'/banquet/choose-event'} className={`${styles.corporate} ${styles.imageWrapper}`}>
                <Image
                    src={'/gallery/gallery.png'}
                    alt={"Галерея"}
                    style={{ objectFit: 'cover' }}
                    sizes='100vw'
                    fill
                />
                <div className={styles.imageText}>
                    <span className={styles.upper}>{'Корпоратив'}</span>
                    <span className={styles.middle}>{'доверьте ВАШ день в НАШИ руки'}</span>
                    <span className={styles.bottom}>{'от 200 тыс. руб.'}</span>
                </div>
            </Link>
            <Link href={'/banquet/choose-event'} className={`${styles.other} ${styles.imageWrapper}`}>
                <Image
                    src={'/gallery/other.png'}
                    alt={"Другое"}
                    style={{ objectFit: 'cover', borderRadius: '0px 0px 30px 0px' }}
                    sizes='100vw'
                    fill
                />
                <div className={styles.imageText}>
                    <span className={styles.upper}>{'Другое'}</span>
                    <span className={styles.middle}>{'Напишу в комментариях'}</span>
                    <span className={styles.bottom}>{'от 10 тыс. руб.'}</span>
                </div>
            </Link>
        </div>
    )
}