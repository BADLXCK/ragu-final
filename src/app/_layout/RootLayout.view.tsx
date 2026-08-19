import localFont from 'next/font/local';
import { ViewTransition } from 'react';
import { Toaster } from 'sonner';
import { getNavigationItems } from '@/api/queries/getNavigationItems';
import { Logo } from '@/components/Logo';
import { MainNavigation } from '../../components/MainNavigation';
import { Background } from './Background';
import { Burger } from './Burger';
import { Contacts } from './Contacts';
import styles from './RootLayout.module.css';

const denistina = localFont({
	src: '../../fonts/DeniStina.woff2',
	variable: '--font-denistina',
	weight: '400',
});

const kudry = localFont({
	src: '../../fonts/Kudry Weird Headline.woff2',
	variable: '--font-kudry',
	weight: '300',
});

const montserratRegular = localFont({
	src: '../../fonts/MontserratAlternates-Regular.ttf',
	variable: '--font-montserrat',
	weight: '700',
});

const montserratAlternates = localFont({
	src: '../../fonts/MontserratAlternates-Bold.ttf',
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
				<Toaster
					position="top-center"
					toastOptions={{
						style: {
							background: 'var(--foreground)',
							color: 'var(--background)',
							border: 'none',
						},
					}}
				/>
				<Burger />
				<div className={styles.sidebarArea}>
					<Logo className={styles.logo} />
					<p className={styles.motto}>
						Место с уютной атмосферой и&nbsp;вкусной едой
					</p>
					<MainNavigation items={navigationItems} />
					<Contacts />
				</div>
				<div className={styles.pageAreaWrapper}>
					<ViewTransition name="page">
						<main className={styles.pageArea}>
							<Background>{children}</Background>
						</main>
					</ViewTransition>
				</div>
			</body>
		</html>
	);
}
