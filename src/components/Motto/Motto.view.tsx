import { FC } from "react";
import styles from './Motto.module.scss';
import clsx from "clsx";

interface MottoProps {
    className?: string;
}

export const Motto: FC<MottoProps> = ({ className }) => {
    return (
        <p className={clsx(styles.motto, className)}>Место с уютной атмосферой и&nbsp;вкусной едой</p>
    )
}