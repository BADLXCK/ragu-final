import { Metadata } from "next";
import { ConditionsPage } from "@/routes/conditions";

import { generatePageMetadata } from "@/utils/generatePageMetadata";

export async function generateMetadata(): Promise<Metadata> {
  return generatePageMetadata(
    "/banquet/choose-event/conditions/",
    "Условия банкета | Семейный ресторан Рагу",
    "Условия проведения банкетов в ресторане Рагу"
  );
}

export default ConditionsPage;