import localFont from "next/font/local";
import { MainNavigation } from "../../components/main-navigation";
import styles from './RootLayout.module.scss';
import { Logo } from "@/components/logo";
import { Contacts } from "@/components/contacts";
import { Background } from "@/components/background";
import { Burger } from "@/components/burger";
import { getNavigationItems } from "@/api/queries/getNavigationItems";
import { Title } from "@/components/title";
import { Motto } from "@/components/Motto";

const denistina = localFont({
    src: "../../app/fonts/DeniStina.woff2",
    variable: "--font-denistina",
    weight: "400",
});

const kudry = localFont({
    src: "../../app/fonts/Kudry Weird Headline.woff2",
    variable: "--font-kudry",
    weight: "300",
});

const montserratRegular = localFont({
    src: "../../app/fonts/MontserratAlternates-Regular.ttf",
    variable: "--font-montserrat",
    weight: "700",
});

const montserratAlternates = localFont({
    src: "../../app/fonts/MontserratAlternates-Bold.ttf",
    variable: "--font-montserrat-alternates",
    weight: "700",
});

export async function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const navigationItems = await getNavigationItems();
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
                <Title className={styles.title} />
                <div className={styles.sidebarArea}>
                    <Logo className={styles.logo} />
                    <Motto className={styles.motto} />
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
