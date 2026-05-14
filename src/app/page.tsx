import { Metadata } from "next";
import { MainPage } from "@/routes/main";

import { generatePageMetadata } from "@/utils/generatePageMetadata";

export async function generateMetadata(): Promise<Metadata> {
  return generatePageMetadata(
    "/",
    "Главная | Семейный ресторан Рагу",
    "Главная страница семейного ресторана Рагу"
  );
}

export default MainPage;