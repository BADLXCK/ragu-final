import { Metadata } from "next";
import { ReviewsPage } from "@/routes/reviews";

import { generatePageMetadata } from "@/utils/generatePageMetadata";

export async function generateMetadata(): Promise<Metadata> {
  return generatePageMetadata(
    "/reviews/",
    "Отзывы | Семейный ресторан Рагу",
    "Отзывы гостей о семейном ресторане Рагу"
  );
}

export default ReviewsPage;