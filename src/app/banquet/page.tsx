import { Metadata } from "next";
import { BanquetPage } from "@/routes/banquet";

import { generatePageMetadata } from "@/utils/generatePageMetadata";

export async function generateMetadata(): Promise<Metadata> {
  return generatePageMetadata(
    "/banquet/",
    "Банкеты | Семейный ресторан Рагу",
    "Организация банкетов и праздников в ресторане Рагу"
  );
}

export default BanquetPage;