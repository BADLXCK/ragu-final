import { Metadata } from "next";
import { InfoPage } from "@/routes/info";

import { generatePageMetadata } from "@/utils/generatePageMetadata";

export async function generateMetadata(): Promise<Metadata> {
  return generatePageMetadata(
    "/info/",
    "Информация | Семейный ресторан Рагу",
    "Информация о ресторане Рагу, наша история и правила"
  );
}

export default InfoPage;