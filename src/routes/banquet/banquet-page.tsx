'use client';

import styles from './banquet-page.module.scss';
import { CustomButton } from "@/components/custom-button";
import { FormInput } from "@/components/form-input";
import { FormTextArea } from "@/components/form-textarea";
import Image from "next/image";
import { usePhoneMask } from "@/hooks/usePhoneMask";
import Link from 'next/link';
import { useRef } from 'react';
import { sendMessageToBot } from '@/api/bot';

export default function BanquetPage() {
    const formRef = useRef<HTMLFormElement>(null);
    const { mask, onInput, onKeyDown } = usePhoneMask();

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!formRef.current) return;

        // Проверяем валидность формы
        if (!formRef.current.checkValidity()) {
            formRef.current.reportValidity();
            return;
        }

        const formData = new FormData(formRef.current);
        const data = Object.fromEntries(formData);
        const phone = data.phone.toString().replace(/\D/g, '');
        const text = `Бронирование банкета:\nИмя: ${data.name}\nТелефон: +${phone}\nКомментарий: ${data.comment}`;
        sendMessageToBot(text);
    }

    return (
        <div className={styles.wrapper}>
            <div className={styles.titleWrapper}>
                <p className={styles.first}>{'Забронировать банкет'}</p>
                <p className={styles.second}>{'Мы перезвоним Вам в течение 15 минут для подтверждения'}</p>
            </div>
            <form style={{ display: 'contents' }} ref={formRef} onSubmit={handleSubmit}>
                <CustomButton label={"Отправить"} style={{ width: '100%' }} className={styles.submit} />
                <FormInput label={"Имя"} placeholder={"Введите имя"} name={"name"} className={styles.name} required />
                <FormInput label={"Телефон"} placeholder={"Введите номер телефона"} name={"phone"} onInput={onInput} required onKeyDown={onKeyDown} value={mask} className={styles.phone} />
                <FormTextArea label={"Комментарий"} placeholder={"Введите комментарий"} name={"comment"} rows={7} className={styles.comment} />
            </form>
            <p className={styles.choose}>{'Выбрать мероприятие'}</p>
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