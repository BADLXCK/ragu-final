import Image from "next/image";
import styles from './main-page.module.scss';
import Link from "next/link";
import { Logo } from "@/components/logo";

export const MainPage = () => {
    return (
        <div data-mainpage={true} className={styles.pageWrapper}>
            <p className={styles.catchPhrase}>
                {'Ресторан - это как театр.\n Наша задача - ослепить, поразить,\n развлечь Вас...\n ничем не выдав, какая за кулисами\n творится Хиросима.'}
            </p>
            <Logo className={styles.logo} />
            <p className={styles.text}>Место с уютной атмосферой и&nbsp;вкусной едой</p>
            <Link href={'/menu'} className={styles.menuButton}>Меню</Link>
        </div>
    );
}
