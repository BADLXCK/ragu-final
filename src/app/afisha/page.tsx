import { Metadata } from "next";
import { AfishaPage } from "@/routes/afisha";

import { generatePageMetadata } from "@/utils/generatePageMetadata";

export async function generateMetadata(): Promise<Metadata> {
  return generatePageMetadata(
    "/afisha/",
    "Афиша | Семейный ресторан Рагу",
    "Афиша мероприятий и мастер-классов в ресторане Рагу"
  );
}

export const dynamic = 'force-dynamic';

export default AfishaPage;
