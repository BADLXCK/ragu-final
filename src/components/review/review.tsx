import Image from "next/image";
import { FC } from "react";
import styles from './review.module.scss';
import { nanoid } from "nanoid";

export interface IReview {
    name: string,
    gender: 'male' | 'female',
    comment: string,
    source: 'yandex' | '2gis',
    rate: 1 | 2 | 3 | 4 | 5,
}

export const Review: FC<IReview> = (props) => {
    const {
        name,
        gender,
        comment,
        source,
        rate,
    } = props;

    return (
        <div key={nanoid()} className={styles.container}>
            <div className={styles.avatarContainer}>
                <div className={styles.avatar}>
                    <Image
                        src={gender === 'male' ? '/man.svg' : '/woman.svg'}
                        alt={'Аватар'}
                        width={34}
                        height={34}
                    />
                </div>
            </div>
            <div className={styles.review} style={{ flex: 1 }}>
                <p className={styles.name}>{name}</p>
                <p className={styles.comment}>{comment}</p>
                <div className={styles.rate}>
                    {Array.from(new Array(rate)).map((_, index) =>
                        <Image
                            key={index}
                            src={'/star.svg'}
                            alt={'Оценка'}
                            width={24}
                            height={23}
                        />
                    )}
                </div>
                <div className={styles.source}>
                    {source === '2gis' ?
                        <Image
                            src={'/2gis.svg'}
                            alt={'2ГИС'}
                            width={47}
                            height={20}
                        /> :
                        <Image
                            src={'/yandex.svg'}
                            alt={'Яндекс'}
                            width={20}
                            height={20}
                        />}
                </div>
            </div>
        </div>
    );
};