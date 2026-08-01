import Link from 'next/link';
import { Logo } from '@/components/Logo';
import styles from './MainPage.module.css';

const catchPhrase =
	'Ресторан - это как театр.\n Наша задача - ослепить, поразить,\n развлечь Вас...\n ничем не выдав, какая за кулисами\n творится Хиросима.';

export const MainPage = () => {
	return (
		<div data-mainpage={true} className={styles.pageWrapper}>
			<p className={styles.catchPhrase}>{catchPhrase}</p>
			<Logo className={styles.logo} />
			<p className={styles.text}>
				Место с уютной атмосферой и&nbsp;вкусной едой
			</p>
			<Link href="/menu" className={styles.menuButton}>
				Меню
			</Link>
		</div>
	);
};
