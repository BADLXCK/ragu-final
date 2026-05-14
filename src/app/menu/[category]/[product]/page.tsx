import { Metadata } from "next";
import { ProductPage } from "@/routes/product";

import { generatePageMetadata } from "@/utils/generatePageMetadata";

type Props = {
  params: Promise<{ category: string; product: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { product } = await params;
  return generatePageMetadata(
    `/product/${product}/`,
    "Заказ блюда | Семейный ресторан Рагу",
    "Заказать блюдо с доставкой из ресторана Рагу"
  );
}

export const dynamicParams = true;
export const revalidate = 60;

export default ProductPage;
