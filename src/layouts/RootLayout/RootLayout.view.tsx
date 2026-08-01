import localFont from 'next/font/local';
import { getNavigationItems } from '@/api/queries/getNavigationItems';
import { Logo } from '@/components/Logo';
import { Motto } from '@/components/Motto';
import { MainNavigation } from '../../components/MainNavigation';
import { Background } from './Background';
import { Burger } from './Burger';
import { Contacts } from './Contacts';
import styles from './RootLayout.module.css';

const denistina = localFont({
	src: '../../app/fonts/DeniStina.woff2',
	variable: '--font-denistina',
	weight: '400',
});

const kudry = localFont({
	src: '../../app/fonts/Kudry Weird Headline.woff2',
	variable: '--font-kudry',
	weight: '300',
});

const montserratRegular = localFont({
	src: '../../app/fonts/MontserratAlternates-Regular.ttf',
	variable: '--font-montserrat',
	weight: '700',
});

const montserratAlternates = localFont({
	src: '../../app/fonts/MontserratAlternates-Bold.ttf',
	variable: '--font-montserrat-alternates',
	weight: '700',
});

export async function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	let navigationItems: Awaited<ReturnType<typeof getNavigationItems>> = [];

	try {
		navigationItems = await getNavigationItems();
	} catch {
		// Navigation items will be empty during build
	}

	const layoutClassName = `
    ${styles.layoutArea}
    ${denistina.variable}
    ${kudry.variable}
    ${montserratRegular.variable}
    ${montserratAlternates.variable}
    `;

	return (
		<html lang="ru">
			<body className={layoutClassName}>
				<Burger />
				<div className={styles.sidebarArea}>
					<Logo className={styles.logo} />
					<Motto />
					<MainNavigation items={navigationItems} />
					<Contacts />
				</div>
				<div className={styles.pageAreaWrapper}>
					<main className={styles.pageArea}>
						<Background>{children}</Background>
					</main>
				</div>
			</body>
		</html>
	);
}
