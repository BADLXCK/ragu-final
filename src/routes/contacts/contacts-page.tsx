import { CustomButton } from '@/components/custom-button';
import styles from './contacts-page.module.scss';
import { ContactsFormInput } from '@/components/contacts-form-input';
import { YandexMap } from '@/components/yandex-map';
import { LinkButton } from '@/components/LinkButton';

export default function ContactsPage() {
    const currentDate = new Date();
    return (
        <div className={styles.container}>
            <div className={styles.location}>
                <h2>{'Локация'}</h2>
                <p className={styles.locationText}>{'Кадетская линия В.О., 9 | 199004'}</p>
                <p className={styles.phone}><a href="tel:+78122443240">{'+7 (812) 244-32-40'}</a></p>
            </div>
            <div className={styles.workingTime}>
                <h2>{'Часы работы'}</h2>
                <p>{'11:00 - 23:00 | Пн-Вс | До последнего гостя'}</p>
            </div>
            <div className={styles.buttons}>
                <LinkButton href="https://clck.ru/3PD7HN" text="Виртуальный тур по ресторану" style={{ width: '522px' }} />
            </div>
            <div className={styles.phoneSecondary}><a href="tel:+78122443240">{'+7 (812) 244-32-40'}</a></div>
            <YandexMap className={styles.map} />
            <div className={styles.socialMedia}>
                <CustomButton label='' style={{ background: 'url(/telegram.svg) no-repeat', height: 45, width: 45 }} />
                <CustomButton label='' style={{ background: 'url(/vk.svg) no-repeat', height: 45, width: 45 }} />
                <CustomButton label='' style={{ background: 'url(/whatsapp.svg) no-repeat', height: 45, width: 45 }} />
            </div>
            <div className={styles.subscribe}>
                <p>{'Подпишитесь'}</p>
                <p>{'чтобы быть в курсе скидок и событий'}</p>
            </div>
            <div className={styles.emailFormTitle}>
                <p>{'Введите свои данные'}</p>
                <p>{'Мы гарантируем конфиденциальность ваших данных'}</p>
            </div>
            <div className={styles.emailForm}>
                <ContactsFormInput name='name' placeholder='Имя' />
                <ContactsFormInput name='secondName' placeholder='Фамилия' />
                <ContactsFormInput name='email' placeholder='Email' />
                <CustomButton label={'Подписаться'} style={{ padding: 20 }} />
            </div>
            <div className={styles.credits}>
                {`RAGU GROUP © 2017 - ${currentDate.getFullYear()} Санкт-Петербург | ragu@mail.ru`}
            </div>
            {/* <div className={styles.bottomArea}>
                <div className={styles.socialMedia}>
                    <CustomButton label='' style={{ background: 'url(/telegram.svg) no-repeat', height: 45, width: 45 }} />
                    <CustomButton label='' style={{ background: 'url(/vk.svg) no-repeat', height: 45, width: 45 }} />
                    <CustomButton label='' style={{ background: 'url(/whatsapp.svg) no-repeat', height: 45, width: 45 }} />
                </div>
                <div className={styles.subscribe}>
                    <p>{'Подпишитесь'}</p>
                    <p>{'чтобы быть в курсе скидок и событий'}</p>
                </div>
                <div className={styles.emailFormTitle}>
                    <p>{'Введите свои данные'}</p>
                    <p>{'Мы гарантируем конфиденциальность ваших данных'}</p>
                </div>
                <div className={styles.emailForm}>
                    <ContactsFormInput name='name' placeholder='Имя' />
                    <ContactsFormInput name='secondName' placeholder='Фамилия' />
                    <ContactsFormInput name='email' placeholder='Email' />
                    <CustomButton label={'Подписаться'} style={{ padding: 20 }} />
                </div>
                <div className={styles.credits}>
                    {`RAGU GROUP © 2017 - ${currentDate.getFullYear()} Санкт-Петербург | ragu@mail.ru`}
                </div>
            </div> */}
        </div>
    )
}