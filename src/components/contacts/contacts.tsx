import { FC } from 'react';
import styles from './contacts.module.scss';

export const Contacts: FC = () => {
    return (
        <div className={styles.wrapper}>
            <span>{'Кадетская линия в.о., д.9'}</span>
            <span><a href="tel:+78122443240">{'+7 (812) 244-32-40'}</a></span>
        </div>
    )
}