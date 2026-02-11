import { ReservationForm } from '@/components/reservation-form';
import styles from './reserve-page.module.scss';
import { ForwardLink } from '@/components/forward-link';
import { GalleryWidget } from '@/components/gallery-widget';
import Link from 'next/link';
import Image from 'next/image';

export default function ReservePage() {
    return (
        <div className={styles.wrapper}>
            <div className={styles.reserveTable}>
                <h2>{'Забронировать стол'}</h2>
                <span>{'Выберите удобную для вас время и дату. Эта информация необходима, чтобы не переживать за наличие места.'}</span>
                <ReservationForm />
            </div>
            <div className={styles.reserveBanquet}>
                <div className={styles.reserveBanquetText}>
                    <h2>{'Забронировать банкет'}</h2>
                    <span>{'Организация банкетного обслуживания мероприятий любого формата.'}</span>
                </div>
                <ForwardLink src='/forwardUp.svg' href={'/banquet'} alt={'Забронировать банкет'} />
            </div>
            <div className={styles.gallery}>
                <Link className={styles.galleryText} href={'/gallery'}>
                    <h2>{'Галерея ресторана'}</h2>
                    <Image src={'/forwardUp.svg'} width={40} height={40} alt={'Галерея ресторана'} />
                </Link>
                <GalleryWidget className={styles.galleryWidget} />
            </div>
            <div className={styles.location}>
                <span>Локация</span>
                <span>Кадетская линия В.О., 9 | 199004</span>
                <span>+7 (812) 244-32-40</span>
                <Link className={styles.contactsLink} href={'/contacts'}>Как добраться</Link>
            </div>
            <div className={styles.workingTime}>
                <span>{'Часы работы'}</span>
                <span>{'11:00 - 23:00 | Вс-Чт'}</span>
                <span>{'11:00 - 01:00 | Пт-Сб'}</span>
            </div>
        </div>
    )
};