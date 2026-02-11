import { getEvents } from '@/api/products.api';
import styles from './afisha-page.module.scss';
import { CustomButton } from '@/components/custom-button';
import { ForwardLink } from '@/components/forward-link';
import { LinkButton } from '@/components/LinkButton';

export default async function AfishaPage() {
    const events = await getEvents();

    return (
        <div className={styles.wrapper}>
            <div className={styles.reserve}>
                <div className={styles.contactUsText}>
                    <p className={styles.first}>{'Свяжитесь с нами'}</p>
                    <p className={styles.second}>{'Мы перезвоним Вам в течение 15 минут для подтверждения'}</p>
                </div>
                <div className={styles.sendButton}>
                    <LinkButton href="tel:+78122443240" text="Позвонить" />
                </div>
            </div>
            <div className={styles.description}>
                <h1>{'Афиша'}</h1>
                <h2>{'Мероприятия'}</h2>
                <p>{'Сама идея работы генератора заимствована у псевдосоветского "универсального кода речей", из которого мы выдернули используемые в нём словосочетания, запилили приличное количество собственных, в несколько раз усложнили алгоритм, добавив новые схемы сборки'}</p>
            </div>
            <div className={styles.gallery}>
                <div className={styles.galleryText}>
                    <h2>{'Галерея'}</h2>
                    <span>{'Фото прошедших мероприятий'}</span>
                </div>
                <ForwardLink src='/forwardUp.svg' href={'/gallery'} alt={'Перейти в галерею'} />
            </div>
            <div className={styles.events}>
                {events.map(event =>
                    <div className={styles.eventWrapper} key={event.id}>
                        <div className={styles.event}>
                            <span className={styles.eventDate}>{event.eventdate}</span>
                            <span className={styles.eventTitle}>{event.eventname}</span>
                            <span className={styles.eventDescription}>{event.eventdescription}</span>
                        </div>
                        <CustomButton type='button' label='Пойду' className={styles.eventButton} />
                    </div>
                )}
            </div>
        </div>
    )
}