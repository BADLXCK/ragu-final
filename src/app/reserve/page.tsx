import { Metadata } from "next";
import { ReservePage } from "@/routes/reserve";

import { generatePageMetadata } from "@/utils/generatePageMetadata";

export async function generateMetadata(): Promise<Metadata> {
  return generatePageMetadata(
    "/reserve/",
    "Бронь стола | Семейный ресторан Рагу",
    "Забронировать столик в семейном ресторане Рагу"
  );
}

export default ReservePage