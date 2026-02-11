'use client';

import { useState } from 'react';
import Image from 'next/image';
import styles from './choose-event.module.scss';
import { ForwardLink } from '@/components/forward-link';
import { CustomButton } from '@/components/custom-button';
import Link from 'next/link';

type EventKeys = 'all' | 'fireplace' | 'podium';

const events: { id: EventKeys, name: string, description: string, conditions: string[] }[] = [
    {
        id: 'all',
        name: 'Весь ресторан',
        description: 'Для вас будет закрыт весь ресторан и весь персонал будет предоставлены только вам',
        conditions: ['Вместимость: до 100 человек', 'Средний чек: 4 000 - 5 000 руб. на одного гостя в зависимости от пожеланий по меню', 'Стоимость: от 500 тыс. руб.'],
    },
    {
        id: 'fireplace',
        name: 'Камин',
        description: 'Для вас будет закрыта зона с камином на березовых дровах. Большой зал с теплой атмосферой и приятным запахом',
        conditions: ['Вместимость: до 60 человек', 'Средний чек: 4 000 - 5 000 руб. на одного гостя в зависимости от пожеланий по меню', 'Стоимость: от 50 тыс. руб.'],
    },
    {
        id: 'podium',
        name: 'Подиум',
        description: 'Для вас будет закрыта зона с подиумом. Большой зал с теплой атмосферой',
        conditions: ['Вместимость: до 60 человек', 'Средний чек: 4 000 - 5 000 руб. на одного гостя в зависимости от пожеланий по меню', 'Стоимость: от 50 тыс. руб.'],
    },
]

export default function ChooseEventPage() {
    const [selected, setSelected] = useState<'all' | 'fireplace' | 'podium'>('all');

    return (
        <div className={styles.wrapper}>
            <div className={styles.info}>
                <div className={styles.select}>
                    {events.map(event => <button className={selected === event.id ? styles.active : ''} key={event.id} onClick={() => setSelected(event.id)}>{event.name}</button>)}
                </div>
                <div className={styles.description}>{events.find(event => event.id === selected)?.description}</div>
                <div className={styles.map}>
                    <Image
                        src={'/map.png'}
                        alt="Схема ресторана"
                        fill
                        style={{ objectFit: 'contain' }}
                        sizes='100vw 200px'
                    />
                </div>
                <div className={styles.conditions}>
                    {events.find(event => event.id === selected)?.conditions.map(condition => <span key={condition}>{condition}</span>)}
                </div>
                <Link href={'/banquet/choose-event/conditions'} className={styles.conditionsLink}>
                    <span>Условия аренды</span>
                    <Image src={'/forwardUp.svg'} width={56} height={56} alt={'Забронировать'} />
                </Link>
                <CustomButton label={'Забронировать'} style={{ width: '70%', alignSelf: 'center' }} />
            </div>
            <div className={styles.gallery}>

            </div>
        </div>
    );
}
