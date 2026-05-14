import type { Metadata } from "next";
import { RootLayout } from '../layouts/RootLayout';
import './styles/globals.css';

import { getGlobalSeo } from "@/api/queries/getGlobalSeo";

export async function generateMetadata(): Promise<Metadata> {
  const globalSeo = await getGlobalSeo();
  
  return {
    title: {
      // TSF уже добавляет название сайта к каждому title, поэтому template не нужен
      absolute: globalSeo?.title || "Семейный ресторан Рагу",
      default: globalSeo?.title || "Семейный ресторан Рагу",
      template: "%s",
    },
    description: globalSeo?.description || "Бронирование столиков и банкеты в ресторане Рагу",
  };
}

export default RootLayout;
