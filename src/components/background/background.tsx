import { FC, ReactNode } from "react";
import Image from "next/image";
import styles from './background.module.scss';

interface IBackground {
    children: ReactNode,
}

export const Background: FC<IBackground> = ({ children }) => {
    return (
        <>
            <Image
                src={'/background.png'}
                className={`${styles.background}`}
                quality={100}
                alt={'Фон с камином'}
                fill
            />
            <div className={styles.wrapper}>
                {children}
            </div>
        </>
    )
}