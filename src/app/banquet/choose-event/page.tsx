import { Metadata } from "next";
import { ChooseEventPage } from "@/routes/choose-event";

import { generatePageMetadata } from "@/utils/generatePageMetadata";

export async function generateMetadata(): Promise<Metadata> {
  return generatePageMetadata(
    "/banquet/choose-event/",
    "Выбор мероприятия | Семейный ресторан Рагу",
    "Выберите тип мероприятия для вашего банкета в ресторане Рагу"
  );
}

export default ChooseEventPage