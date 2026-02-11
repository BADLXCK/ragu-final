import styles from './conditions.module.scss';
import Image from 'next/image';

export default function ConditionsPage() {
    return (
        <div className={styles.wrapper}>
            <div className={styles.title}>
                <h1>Условия аренды всего ресторана РАГУ</h1>
                <span>При организации торжества используется индивидуальный подход, учитывая пожелания гостей</span>
            </div>
            <div className={styles.description}>
                <span>Вместимость: до 75-100 человек</span>
                <span>Стоимость закрытия зала: Депозит 500 000 рублей</span>
                <span>Что входит в средний чек (1 кг еды на гостя):</span>
                <div className={styles.menu}>
                    <span>750 гр. - Холодные и горячие закуски, салаты;</span>
                    <span>250 гр. - Горячее, согласовывая 4-6 горячих блюд;</span>
                    <span>600 мл. - Вода, морс; + 10% сервисный сбор;</span>
                </div>
            </div>
            <div className={styles.alcohol}>
                <span>Свой алкоголь:</span>
                <span>Пробковый сбор - 500 руб/бутылка.</span>
                <span>Также можно  приобрести алкоголь по специальному банкетному предложению</span>
            </div>
            <div className={styles.rent}>
                <span>Арендная плата:</span>
                <span>Время работы ресторана:</span>
                <span>пн-чт, вс: 11:00 - 23:00</span>
                <span>пт-сб: 11:00 - 01:00</span>
                <span>каждый последующий час - 20 000 рублей,(продление возможно с ограничением по звуку)</span>
            </div>
            <div className={styles.textile}>
                <span>Текстиль:</span>
                <span>Скатерть - серая, ручники - серые</span>
            </div>
            <div className={styles.interior}>
                <span>Оформление:</span>
                <span>Цветочные композиции (вазы с цветами) на столах,светильники, свечи</span>
            </div>
            <div className={styles.soundHardware}>
                <span>Звуковая аппаратура:</span>
                <span>Фоновая музыка - бесплатно.</span>
                <span>Аренда оборудования - 12 000 рублей (2 колонки, 2 микрофона и стойки, микшер, сцена, световые головы)</span>
            </div>
            <div className={styles.soundTechnician}>
                <span>Работа звукотехника:</span>
                <span>По договорённости</span>
            </div>
            <div className={styles.gallery}>
                <Image src={'/gallery/gallery.png'} alt={'Фото'} fill style={{ objectFit: 'cover', borderRadius: '30px' }} sizes='200px' />
            </div>
        </div>
    );
}
