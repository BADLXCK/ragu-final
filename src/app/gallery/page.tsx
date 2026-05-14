import { Metadata } from "next";
import { GalleryPage } from "@/routes/gallery";

import { generatePageMetadata } from "@/utils/generatePageMetadata";

export async function generateMetadata(): Promise<Metadata> {
  return generatePageMetadata(
    "/gallery/",
    "Галерея | Семейный ресторан Рагу",
    "Фотографии интерьера и блюд семейного ресторана Рагу"
  );
}

export default GalleryPage