import { Metadata } from 'next';
import { getSeoByUri } from '@/api/queries/getSeoByUri';
import { CategoryPage } from "@/routes/category";

const BASE_URI = '/product-category/';

type Props = {
  params: Promise<{ category: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category } = await params;
  return await getSeoByUri(`${BASE_URI}${category}/`);
}

export default CategoryPage;
