import { Metadata } from "next";
import { CategoryPage } from "@/routes/category";

import { generatePageMetadata } from "@/utils/generatePageMetadata";

type Props = {
  params: Promise<{ category: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category } = await params;
  return generatePageMetadata(
    `/product-category/${category}/`,
    "Меню | Семейный ресторан Рагу",
    "Меню доставки и ресторана Рагу"
  );
}

export default CategoryPage;
